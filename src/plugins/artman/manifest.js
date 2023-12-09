import {lazy} from "react";

export default {
    "requiredResources": [
        //{name: "be_artman_analytics_v1", methods: ["GET"]},
    ],
    "name": "analytics",
    "label": "Analytiky",
    "module": lazy(() => import(`./Analytics`)),
}