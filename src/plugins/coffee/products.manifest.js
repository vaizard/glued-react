import {lazy} from "react";

export default {
    "requiredResources": [

    ],
    "name": "products",
    "label": "Produkty",
    "module": lazy(() => import(`./Products`)),
}