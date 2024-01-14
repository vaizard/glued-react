import {GridRowId, GridRowModes, GridRowModesModel} from "@mui/x-data-grid";


export const isRowInEditMode = (id: GridRowId, model: GridRowModesModel) => {
    const rowMode = model[id]?.mode ?? GridRowModes.View
    return rowMode == GridRowModes.Edit
}