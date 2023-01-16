import CenteredBox from "./CenteredBox";
import CircularProgress from "@mui/material/CircularProgress/CircularProgress";
import React from "react";

const CenteredLoader = (props) => {
    return <CenteredBox>
        <CircularProgress />
    </CenteredBox>
}

export default CenteredLoader;