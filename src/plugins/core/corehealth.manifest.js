import {lazy} from "react";

export default {
    "requiredResources": [
        // resource names required for this plugin to show up in menu
    ],
    "name": "core-health",
    "label": "Health",
    "module": lazy(() => import(`./CoreHealth`)),
}
