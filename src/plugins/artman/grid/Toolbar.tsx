import React from "react";
import {GridToolbarContainer, GridToolbarDensitySelector, ToolbarPropsOverrides} from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";


declare module '@mui/x-data-grid' {
    interface ToolbarPropsOverrides {
        onAdd?: () => void
        onRefresh?: () => void
    }
}

const Toolbar: React.FC<ToolbarPropsOverrides> = ({onAdd, onRefresh}) => {


    return (
        <GridToolbarContainer>
            {onRefresh && <IconButton onClick={onRefresh}><RefreshIcon/></IconButton>}
            {onAdd && <IconButton onClick={onAdd}><AddIcon/></IconButton>}
            <GridToolbarDensitySelector />
        </GridToolbarContainer>
    );
}

export default Toolbar