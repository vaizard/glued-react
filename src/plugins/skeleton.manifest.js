import {lazy} from "react";

export default {
    "requiredResources": [
        // resource names required for this plugin to show up in menu
    ],
    "name": "skeleton",
    "label": "Skeleton",
    "module": lazy(() => import(`./Skeleton`)),
}