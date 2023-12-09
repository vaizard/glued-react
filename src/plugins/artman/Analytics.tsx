import React, {FC, useContext} from 'react';
import AuthenticationContext from "../../AuthenticationContext";
import {useData} from "./utils";
import {PluginProps} from "../../types/plugins";
import {Analytic} from "./types";
import {DataGrid, GridColDef, GridRowModes, GridToolbarContainer, GridToolbarProps} from "@mui/x-data-grid";
import CenteredLoader from "../../tools/CenteredLoader";
import Button from "@mui/material/Button";
import {randomUUID} from "crypto";
import {uuid} from "../../tools/uuid";
import {ToolbarProps} from "@mui/material";


const Analytics : FC<PluginProps> = (props) => {
    const context = useContext(AuthenticationContext)
    const analyticsEndpoint = props.endpoints.get('be_artman_analytics_v1')?.url
    let analytics = useData<Analytic[]>(analyticsEndpoint, context?.authenticatedFetch);

    console.log(analytics)

    if(analyticsEndpoint == undefined) {
        return <>{"Chyba - chybí endpoint be_artman_analytics_v1!"}</> // TODO: make this thing better!
    }


    const columns: GridColDef<Analytic>[]  = [
        { headerName: 'Kód', width: 100, valueGetter: ({row}) => row.code, type: "number", field: "code" },
        { headerName: 'Název', width: 500, valueGetter: ({row}) => row.name, type: "string", field: "name" },
        { headerName: 'UUID', width: 150, valueGetter: ({row}) => row.uuid, type: "string", field: "uuid"},
    ];

    return <DataGrid rows={analytics ?? []} columns={columns} getRowId={it => it.uuid} slots={{toolbar: Toolbar}} loading={analytics == null}/>

}

function AddIcon() {
    return null;
}

const emptyAnalytic: (uuid: string) => Analytic = (uuid) => ({
    code: "",
    name: "",
    uuid: uuid
})

const Toolbar: React.FC<GridToolbarProps> = (props) => {

    const { setRows, setRowModesModel } = props;
    console.log(props)

    const handleClick = () => {
        const id = uuid();
        setRows((oldRows: Analytic[]) => [...oldRows, emptyAnalytic(id)]);
        setRowModesModel((oldModel: any) => ({
            ...oldModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
        }));
    };

    return (
        <GridToolbarContainer>
            <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
                Přidat analytiku
            </Button>
        </GridToolbarContainer>
    );
}

export default Analytics