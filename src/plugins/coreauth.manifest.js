import {lazy} from "react";

export default {
    "requiredResources": [
        // resource names required for this plugin to show up in menu
    ],
    "name": "Authentication tests",
    "label": "Auth test",
    "module": lazy(() => import(`./CoreAuth`)),
}