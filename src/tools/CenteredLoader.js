import CenteredBox, {HorizontalCenteredBox} from "./CenteredBox";
import CircularProgress from "@mui/material/CircularProgress/CircularProgress";
import React from "react";

const CenteredLoader = ({vertical = true}) => {
    if(!vertical) {
        return <HorizontalCenteredBox>
            <CircularProgress />
        </HorizontalCenteredBox>
    }

    return <CenteredBox>
        <CircularProgress />
    </CenteredBox>
}

export default CenteredLoader;