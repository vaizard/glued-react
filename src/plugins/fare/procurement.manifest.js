import {lazy} from "react";

export default {
    "requiredResources": [
        {name: "be_fare_procurement_v3", methods: ["GET"]},
    ],
    "name": "procurement",
    "label": "Pořízení",
    "module": lazy(() => import(`./Procurement`)),
}