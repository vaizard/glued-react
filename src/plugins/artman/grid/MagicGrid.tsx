import {Row, RowState, RowStateUtil} from "./types/row";
import React, {ReactElement, useMemo, useState} from "react";
import {Setter} from "./internalTypes";
import {filterKeys, notNull} from "../../facturx/utils";
import {
    DataGrid,
    GridColDef,
    GridEventListener,
    GridRowEditStopReasons,
    GridRowId,
    GridRowModes,
    GridRowModesModel
} from "@mui/x-data-grid";
import {GridRowModesModelProps} from "@mui/x-data-grid/models/api/gridEditingApi";
import {createColumn} from "./columns";
import {MagicGridColumn} from "./types/column";
import Toolbar from "./Toolbar";
import {DeleteAction, EditAction, RevertAction, SaveAction} from "./actions";
import {isRowInEditMode} from "./tools";
import {uuid} from "../../../tools/uuid";
import CircularProgress from "@mui/material/CircularProgress";

interface MagicGridProps<T> {
    rows: T[],
    columns: MagicGridColumn<T>[],
    id: (it: T) => string,
    nonce: (it: T) => string,

    /* Editable rows */
    setter?: (id: string, modifications: Record<string, any>) => boolean,     // TODO: type
    /**
     * @param id
     * @param data
     * @returns ID or promise of ID of newly created data.
     *      Undefined or promise of undefined if data could not be saved and should be cleared.
     */
    newRow?: (id: string, data: Record<string, any>) => string | Promise<string>,     // TODO: type
    newRowInit?: () => {
        data?: T
        id?: string
    }
    newRowData?: () => T,
    newRowId?: () => string,
    removeRow?: (id: string) => boolean | Promise<boolean> // TODO: deleteresult?

    /* row actions */
    actions: any[],  // TODO: type

    /*  */
    refresh?: () => void
    loading?: boolean
}


const MagicGrid = <T, >(props: MagicGridProps<T>) => {
    type DirtyRowMap = Record<string, Row<T>>
    const {rows, id, nonce, columns} = props;
    const editable = props.setter !== undefined
    const deleteable = props.removeRow !== undefined

    // TODO: useRef for stale "new" rows

    const rowData: Row<T>[] = useMemo(() => createRowData(rows, columns, id, nonce) , [columns, id, nonce, rows])

    const [dirtyRows, _setDirtyRows] = useState<DirtyRowMap>({}) // TODO: type

    const getStale = () => {
        const currentNonces =
            rows.map(it => [id(it), nonce(it)])

        return new Set(currentNonces
            .filter(([id]) => dirtyRows[id] !== undefined)
            .filter(([id, nonce]) => dirtyRows[id].nonce != nonce)  // Nonce has changed in source data, so the change has been saved or overriden
            .map(([id, nonce]) => id) // We only care about ids
        )

    }

    const setDirtyRows = (block: Setter<DirtyRowMap>) => _setDirtyRows((old) => {
        const stale = getStale()
        const oldWithoutStale = filterKeys(old, (key) => !stale.has(key))
        return block(oldWithoutStale)
    })

    //useMemo?
    const appliedRows = mergeDirtyRows(rowData, dirtyRows)



    const addDirtyRow = (row: Row<T>) => setDirtyRows((oldRows) => {
        const newRows: DirtyRowMap = {}
        newRows[row.id] = row
        return {...oldRows, ...newRows}
    });
    const removeDirtyRow = (id: string) => setDirtyRows(
        (old) => filterKeys(old, it => it != id)
    )

    const [rowModes, setRowModes] = useState<GridRowModesModel>({})
    const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
        setRowModes(newRowModesModel);
    };

    const setEditMode = (id: GridRowId, mode: GridRowModes, extraOptions?: Partial<GridRowModesModelProps>) => setRowModes((original) => (
        { ...original, [id]: { mode: mode, ...(extraOptions ?? {}) } } as GridRowModesModel
    ))

    const { newRow: adder, newRowId, newRowData, newRowInit } = props

    const processAddRow = adder !== undefined ? () => {
        const init = newRowInit?.()
        const [id, nonce] = [init?.id ?? uuid(), uuid()]
        const newRow = init?.data !== undefined
            ? objectToRow(init?.data, columns, id, nonce, RowState.New)
            : emptyRow(id, nonce)
        addDirtyRow(newRow)
        setEditMode(id, GridRowModes.Edit)
    } : undefined

    const {setter, removeRow: deleter} = props

    const changeID = (row: Row<T>, id: string | undefined) => {
        if(row.id === id) { return } // No change needed
        removeDirtyRow(row.id)
        if (id === undefined) { return; } // Do not create new dirty row
        row.id = id
        addDirtyRow(row)
    }

    const processSaveNew = async (row: Row<T>) => {
        const newID = await adder?.(row.id, row.data)
        changeID(row, newID)
    }

    const processSaveExisting = async (row: Row<T>) => {
        await setter?.(row.id, row.data) // ID change not supported for now
        addDirtyRow(row)
    }

    const processRowUpdate = (newRow: Row<T>, oldRow: Row<T>) => {

        const nextState =
            newRow.state === RowState.New ? RowState.New : RowState.Modifying

        const f = newRow.state === RowState.New ? processSaveNew : processSaveExisting

        newRow.state = nextState
        // add as a dirty row
        addDirtyRow(newRow)

        f(newRow)

        return Promise.resolve(newRow)
    }

    const processDelete = deleter !== undefined ? async (id: string) => {
        const row = rowData.find((it) => it.id === id)
        if(row === undefined) { return }
        row.state = RowState.Deleting
        addDirtyRow(row)
        const result = await deleter(id);

        if(!result) {
            removeDirtyRow(id) // Deletion aborted, revert the dirty line
        } // Else wait until the uuid disappears from initial data

    } : undefined




    const actionColumn: GridColDef<Row<T>> =
        { headerName: '', width: 100, field: 'actions', type: 'actions', cellClassName: 'actions',
            getActions: ({ id, row }): ReactElement[] => {
                const actions: Array<ReactElement | null> = []


                if(isRowInEditMode(id, rowModes)){
                    actions.push(
                        <SaveAction id={id} onClick={id => {setEditMode(id, GridRowModes.View)}}/>,
                        <RevertAction id={id} onClick={id => {setEditMode(id, GridRowModes.View, {ignoreModifications: true})}} />
                    )

                } else if(!RowStateUtil.isDirty(row.state)){
                    actions.push(
                        editable ? <EditAction id={id} onClick={id => {setEditMode(id, GridRowModes.Edit)}} /> : null,
                        deleteable ? <DeleteAction id={id} onClick={id => {processDelete?.(id.toString())}} /> : null
                    )
                } else {
                    return [<CircularProgress />]
                }

                return actions.filter(notNull)
            }

        }



    const cols = [
        actionColumn,
        ...columns.map(it => createColumn(it, editable))
    ]


    return <DataGrid
        columns={cols}
        rows={appliedRows}
        getRowId={(it: Row<T>) => it.id}
        slots={{toolbar: Toolbar}}
        rowModesModel={rowModes}
        onRowModesModelChange={handleRowModesModelChange}
        editMode="row"
        processRowUpdate={processRowUpdate}
        onRowEditStop={ignoreFocusOut}
        slotProps={{toolbar: { onAdd: processAddRow, onRefresh: props.refresh }}}
        loading={props.loading ?? false}
        density={'compact'}
        //sortModel={[{field: "code", sort: "asc"}]}
        sx={{height: '100%'}}
    />
};



const objectToRow = <T, >(object: T, columns: Array<MagicGridColumn<T>>, id: string, nonce: string, state = RowState.Saved) => {

    const data = Object.fromEntries(
        columns.map(column => [column.id, column.getter(object)])
    )

    return {
        id: id,
        nonce: nonce,
        state: state,
        data: data
    }
}

const emptyRow = <T, > (id: string, nonce: string): Row<T> => (
    {id: id, nonce: nonce, state: RowState.New, data: {}}
)

const createRowData = <T, >(rows: T[], columns: Array<MagicGridColumn<T>>, id: (it: T) => string | number, nonce: (it: T) => string | number) =>
    rows.map(it =>
        objectToRow(it, columns, id(it).toString(), nonce(it).toString())
    )


const resolveConflict = <T, > (original: Row<T> | undefined, dirty: Row<T> | undefined) => {
    if(dirty === undefined) {
        if(original == undefined) { throw new Error("asd") }
        return original
    }
    if(original === undefined) {
        return dirty.state === RowState.Deleting ? null : dirty
    }
    if(original.nonce == dirty.nonce) { // The change to the original is still not reflected
        return dirty
    }
    return original
}

const mergeDirtyRows = <T, > (rows: Row<T>[], dirtyRows: Record<string, Row<T>>): Row<T>[] => {
    const unseen = new Set(Object.keys(dirtyRows))
    rows.forEach(it => unseen.delete(it.id))

    return [
        ...rows.map(row => resolveConflict(row, dirtyRows[row.id])),
        ...[...unseen].map(id => resolveConflict(undefined, dirtyRows[id]))
    ].filter(notNull)
}

const ignoreFocusOut: GridEventListener<'rowEditStop'> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
        event.defaultMuiPrevented = true;
    }
};


export default MagicGrid;