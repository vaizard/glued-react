import {lazy} from "react";

export default {
    "requiredResources": [
        // resource names required for this plugin to show up in menu
    ],
    "name": "enforce",
    "label": "Enforce",
    "module": lazy(() => import(`./Core`)),
}