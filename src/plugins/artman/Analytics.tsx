import React, {FC, useContext, useState} from 'react';
import AuthenticationContext, {FetchLikeFunction} from "../../AuthenticationContext";
import {relative, RemoteRequestException, useData} from "./utils";
import {PluginProps} from "../../types/plugins";
import {Analytic, AnalyticRow} from "./types";
import {
    DataGrid,
    GridColDef,
    GridEventListener,
    GridRowEditStopReasons,
    GridRowId,
    GridRowModes,
    GridRowModesModel,
    GridToolbarContainer,
    GridToolbarDensitySelector,
    ToolbarPropsOverrides
} from "@mui/x-data-grid";
import {uuid} from "../../tools/uuid";
import AddIcon from "@mui/icons-material/Add";
import {DeleteAction, EditAction, RevertAction, SaveAction} from "./grid/actions";
import {GridRowModesModelProps} from "@mui/x-data-grid/models/api/gridEditingApi";
import IconButton from "@mui/material/IconButton";
import RefreshIcon from '@mui/icons-material/Refresh';

declare module '@mui/x-data-grid' {
    interface ToolbarPropsOverrides {
        onAddAnalytic: (analytic: Analytic) => void
        onRefresh: () => void
    }
}

const ignoreFocusOut: GridEventListener<'rowEditStop'> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
        event.defaultMuiPrevented = true;
    }
};

const updateAnalytic = async (analytic: Analytic, fetchFunction: FetchLikeFunction | undefined, analyticEndpoint: string) => {
    const endpoint = relative(analyticEndpoint, `./${analytic.uuid}`)
    await sendAnalytic(analytic, fetchFunction, endpoint, "put")
}

const createAnalytic = async (analytic: Analytic, fetchFunction: FetchLikeFunction | undefined, analyticEndpoint: string )=> {
    analytic.uuid = uuid()
    await sendAnalytic(analytic, fetchFunction, analyticEndpoint, "post")
}

const realFetch = fetch
const sendAnalytic = async (analytic: Analytic, fetchFunction: FetchLikeFunction | undefined, uri: string | URL, method: string) => {
    const fetch = fetchFunction ?? realFetch
    const response = await fetch(uri, {method: method, body: JSON.stringify(analytic), headers: new Headers({'content-type': 'application/json'})})
    if(!response.ok) {
        throw new RemoteRequestException(`Analytics PUT endpoint returned ${response.status}`)
    }
}


const Analytics : FC<PluginProps> = (props) => {
    const context = useContext(AuthenticationContext)
    const analyticsEndpoint = props.endpoints.get('be_artman_analytics_v1')?.url
    const [analytics, loading, refresh] = useData<Analytic[]>(analyticsEndpoint, context?.authenticatedFetch);
    // analytics not yet saved in db
    const [dirtyAnalytics, setDirtyAnalytics] = useState<Analytic[]>([])
    const [rowModes, setRowModes] = useState<GridRowModesModel>({})

    const addDirtyAnalytic = (analytic: Analytic) => setDirtyAnalytics((old) => [...old, analytic]);
    const removeDirtyAnalytic = (uuid: string) => setDirtyAnalytics((old) => {

        console.log(old.map(it => `${uuid} != ${it.uuid} ? ${uuid != it.uuid}`))
        return old.filter(it => it.uuid != uuid)

    })

    const setEditMode = (id: GridRowId, mode: GridRowModes, extraOptions?: Partial<GridRowModesModelProps>) => setRowModes((original) => (
        { ...original, [id]: { mode: mode, ...(extraOptions ?? {}) } } as GridRowModesModel
    ))

    const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
        setRowModes(newRowModesModel);
    };

    const handleAddAnalytic = (analytic: Analytic) => {
        addDirtyAnalytic(analytic)
        setEditMode(analytic.uuid, GridRowModes.Edit)
    }

    const handleDelete = (id: GridRowId) => {alert("not implemented yet")}

    if(analyticsEndpoint == undefined) {
        return <>{"Chyba - chybí endpoint be_artman_analytics_v1!"}</> // TODO: make this thing better!
    }


    const columns: GridColDef<AnalyticRow>[]  = [
        { headerName: 'Kód', width: 100, valueGetter: ({row}) => row.analytic.code, valueSetter: ({row, value}) => {row.analytic.code = value; return row}, type: "string", field: "code", editable: true },
        { headerName: 'Název', width: 500, valueGetter: ({row}) => row.analytic.name, valueSetter: ({row, value}) => {row.analytic.name = value; return row}, type: "string", field: "name", editable: true },
        { headerName: 'UUID', width: 150, valueGetter: ({row}) => row.analytic.uuid, type: "string", field: "uuid"},
        { headerName: 'Actions', width: 100, field: 'actions', type: 'actions', cellClassName: 'actions',
            getActions: ({ id }) => {
                if(!isRowInEditMode(id, rowModes)){
                    return [
                        <EditAction id={id} onClick={id => {setEditMode(id, GridRowModes.Edit)}} />,
                        <DeleteAction id={id} onClick={id => {handleDelete(id)}} />
                    ];
                }
                return [
                    <SaveAction id={id} onClick={id => {setEditMode(id, GridRowModes.View)}}/>,
                    <RevertAction id={id} onClick={id => {setEditMode(id, GridRowModes.View, {ignoreModifications: true})}} />
                ]

            },
        },

    ];

    const rows: AnalyticRow[] = [
        ...(analytics ?? []).map(it => new AnalyticRow(it, false)),
        ...dirtyAnalytics.map(it => new AnalyticRow(it, true)),
    ]



    const processRowUpdate = (newRow: AnalyticRow, oldRow: AnalyticRow) => {
        const processFunction = newRow.isNew ? createAnalytic : updateAnalytic
        processFunction(newRow.analytic, context?.authenticatedFetch, analyticsEndpoint)
            .then(() => {
                removeDirtyAnalytic(newRow.analytic.uuid)
                refresh()
            })

        return Promise.resolve(oldRow)
    }

    return <DataGrid
        columns={columns}
        rows={rows}
        getRowId={(it: AnalyticRow) => it.uuid} slots={{toolbar: Toolbar}}
        rowModesModel={rowModes}
        onRowModesModelChange={handleRowModesModelChange}
        editMode="row"
        processRowUpdate={processRowUpdate}
        onRowEditStop={ignoreFocusOut}
        slotProps={{toolbar: { onAddAnalytic: handleAddAnalytic, onRefresh: refresh }}}
        loading={loading}
        density={'compact'}
        sortModel={[{field: "code", sort: "asc"}]}
        sx={{height: '100%'}}
    />
}

const isRowInEditMode = (id: GridRowId, model: GridRowModesModel) => {
    const rowMode = model[id]?.mode ?? GridRowModes.View
    return rowMode == GridRowModes.Edit
}


const emptyAnalytic: (uuid: string) => Analytic = (uuid) => ({
    code: "",
    name: "",
    uuid: uuid
})

const Toolbar: React.FC<ToolbarPropsOverrides> = ({onAddAnalytic, onRefresh}) => {

    const handleClick = () => {
        onAddAnalytic(emptyAnalytic(uuid()));
    };

    return (
        <GridToolbarContainer>
            <IconButton onClick={onRefresh}><RefreshIcon /></IconButton>
            <IconButton onClick={handleClick}><AddIcon /></IconButton>
            <GridToolbarDensitySelector />
        </GridToolbarContainer>
    );
}

export default Analytics