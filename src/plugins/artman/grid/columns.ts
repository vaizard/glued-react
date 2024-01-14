import {MagicGridColumn} from "./types/column";
import {GridColDef} from "@mui/x-data-grid";
import {Row} from "./types/row";


export function createColumn<T>(it: MagicGridColumn<T>, gridIsEditable = false) {



    const x: GridColDef<Row<T>> = {
        // Direct
        headerName: it.name,
        width: it.width ?? 150,
        type: it.type,
        field: it.id,



        valueGetter: ({row}) => row.data[it.id],
        valueSetter: ({row, value}) => { row.data[it.id] = value; return row },




        editable: gridIsEditable && !(it.readOnly ?? false)
    }

    return x;
}