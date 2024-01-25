import {lazy} from "react";

export default {
    "requiredResources": [
        {name: "be_roasters_simple_products_v1", methods: ["GET"]}
    ],
    "name": "products",
    "label": "Produkty",
    "module": lazy(() => import(`./Products`)),
}