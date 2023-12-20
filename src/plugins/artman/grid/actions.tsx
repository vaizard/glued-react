import {GridActionsCellItem, GridRowId} from "@mui/x-data-grid";
import {Delete as DeleteIcon, Edit as EditIcon, Save as SaveIcon, Undo as UndoIcon} from "@mui/icons-material";


import React from "react";

export type RowActionProps = {id: GridRowId, onClick?: (id: GridRowId) => void}


export const EditAction = ({id, onClick}: RowActionProps) => {
    return <GridActionsCellItem
        icon={<EditIcon />}
        label="Edit"
        className="textPrimary"
        onClick={() => onClick?.(id)}
        color="inherit"
    />
}

export const DeleteAction = ({id, onClick}: RowActionProps) => {
    return <GridActionsCellItem
        icon={<DeleteIcon />}
        label="Delete"
        onClick={() => onClick?.(id)}
        color="inherit"
    />
}

export const SaveAction = ({id, onClick}: RowActionProps) => {
    return <GridActionsCellItem
        icon={<SaveIcon />}
        label="Save"
        onClick={() => onClick?.(id)}
        color="inherit"
    />
}

export const RevertAction = ({id, onClick}: RowActionProps) => {
    return <GridActionsCellItem
        icon={<UndoIcon />}
        label="Save"
        onClick={() => onClick?.(id)}
        color="inherit"
    />
}