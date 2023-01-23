import {lazy} from "react";

export default {
    "requiredResources": [
        // resource names required for this plugin to show up in menu
    ],
    "name": "Authentication status",
    "label": "Auth status",
    "module": lazy(() => import(`./CoreAuth`)),
}