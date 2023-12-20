import {lazy} from "react";

export default {
    "requiredResources": [
    ],
    "name": "table",
    "label": "Table",
    "module": lazy(() => import(`./TableDemo`)),
}