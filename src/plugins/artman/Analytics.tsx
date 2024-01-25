import React, {FC, useContext, useState} from 'react';
import AuthenticationContext, {FetchLikeFunction} from "../../AuthenticationContext";
import {relative, RemoteRequestException, useData} from "../../utils";
import {PluginProps} from "../../types/plugins";
import {Analytic, AnalyticRow, AnalyticUpdate} from "./types";
import {DataGrid, GridColDef, GridRowId, GridRowModes, GridRowModesModel} from "@mui/x-data-grid";
import {uuid} from "../../tools/uuid";
import {DeleteAction, EditAction, RevertAction, SaveAction} from "./grid/actions";
import {GridRowModesModelProps} from "@mui/x-data-grid/models/api/gridEditingApi";
import {MagicGridColumn} from "./grid/types/column";
import MagicGrid from "./grid/MagicGrid";
import {isRowInEditMode} from "./grid/tools";
import Toolbar from "./grid/Toolbar";


type AnalyticSender = (analytic: AnalyticUpdate, fetchFunction: (FetchLikeFunction | undefined), analyticEndpoint: string) => Promise<string>

const updateAnalytic: AnalyticSender = async (analytic: AnalyticUpdate, fetchFunction: FetchLikeFunction | undefined, analyticEndpoint: string) => {
    const endpoint = relative(analyticEndpoint, `./${analytic.uuid}`)
    await sendAnalytic(analytic, fetchFunction, endpoint, "put")
    return analytic.uuid
}

const createAnalytic: AnalyticSender = async (analytic: AnalyticUpdate, fetchFunction: FetchLikeFunction | undefined, analyticEndpoint: string )=> {
    analytic.uuid = uuid()
    const newAnalytic = await sendAnalytic(analytic, fetchFunction, analyticEndpoint, "post")
    return (await newAnalytic.json()).uuid
}


const sendAnalytic = async (analytic: AnalyticUpdate, fetchFunction: FetchLikeFunction | undefined, uri: string | URL, method: string) => {
    const fetch = fetchFunction ?? realFetch
    const response = await fetch(uri, {method: method, body: JSON.stringify(analytic), headers: new Headers({'content-type': 'application/json'})})
    if(!response.ok) {
        throw new RemoteRequestException(`Analytics ${method} endpoint returned ${response.status}`)
    }
    return response
}

const realFetch = fetch
class AnalyticAPI {
    private readonly endpoint: string;
    private readonly fetch: FetchLikeFunction;
    constructor(analyticsEndpoint: string, fetch?: FetchLikeFunction) {
        this.endpoint = analyticsEndpoint;
        this.fetch = fetch ?? realFetch;
    }

    async deleteAnalytic(uuid: string, replacement: string) {
        const body = {
            replacement: replacement
        }
        const response = await this.fetch(relative(this.endpoint, `./${uuid}`), { method: "delete", body: JSON.stringify(body), headers: new Headers({'content-type': 'application/json'})})
        if(!response.ok) {
            throw new RemoteRequestException(`Analytics delete endpoint returned ${response.status}`)
        }
    }
}



const applyChanges = (analytic: AnalyticUpdate, changes: Record<string, any>) => {
    for(const [key, v] of Object.entries(changes)) {
        // @ts-ignore
        analytic[key] = v
    }
    return analytic
}




const NewAnalytics : FC<PluginProps> = (props) => {

    const context = useContext(AuthenticationContext)
    const analyticsEndpoint = props.endpoints.get('be_artman_analytics_v1')?.url
    const [analytics, loading, refresh] = useData<Analytic[]>(analyticsEndpoint, context?.authenticatedFetch);

    if(analyticsEndpoint == undefined) {
        return <>{"Chyba - chybí endpoint be_artman_analytics_v1!"}</> // TODO: make this thing better!
    }

    const api = new AnalyticAPI(analyticsEndpoint, context?.authenticatedFetch)


    const process = async (id: string, changes: Record<string, any>, fun: AnalyticSender) => {
        const update= applyChanges(emptyAnalytic(id), changes)

        const uuid = await fun(update, context?.authenticatedFetch, analyticsEndpoint)
        refresh()
        return uuid
    }

    const processNew = (id: string, changes: Record<string, any>) => process(id, changes, createAnalytic)

    const processRowUpdate = (id: string, changes: Record<string, any>) => {
        process(id, changes, updateAnalytic)
        return true
    }

    const processDelete = async (id: string) => {
        // eslint-disable-next-line
        if(!confirm('Opravdu chcete smazat tuto analytiku?')) {
            return false
        }

        await api.deleteAnalytic(id, "todo") // TODO: handle replacements
        // TODO: handle errors

        refresh()

        return true
    }


    /* Kód, název, UUID */
    const cols: MagicGridColumn<Analytic>[] = [
        {
            getter: it => it.name,
            name: "Název",
            id: "name",

            type: "string",
            width: 200
        },
        {
            getter: it => it.code,
            name: "Kód",
            id: "code",

            type: "string",
            width: 200
        },
        {
            getter: it => it.uuid,
            name: "UUID",
            id: "uuid",
            readOnly: true,

            type: "string",
            width: 200
        },
    ]

    return <MagicGrid
        rows = {analytics ?? []}
        loading = {loading}
        columns = {cols}
        id = {(it) => it.uuid}
        nonce = {(it) => it.nonce}
        refresh={refresh}

        /* editable rows */
        setter = {processRowUpdate}
        newRow = {processNew}
        removeRow = {processDelete}

        /* row actions */
        actions = {[]}




    />
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
        //onRowEditStop={ignoreFocusOut}
        slotProps={{toolbar: { onAddAnalytic: handleAddAnalytic, onRefresh: refresh }}}
        loading={loading}
        density={'compact'}
        sortModel={[{field: "code", sort: "asc"}]}
        sx={{height: '100%'}}
    />
}

const emptyAnalytic: (uuid: string) => AnalyticUpdate = (uuid) => ({
    code: "",
    name: "",
    uuid: uuid
})

export default NewAnalytics