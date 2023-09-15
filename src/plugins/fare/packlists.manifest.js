import {lazy} from "react";

export default {
    "requiredResources": [
        {name: "be_fare_packlists_v3", methods: ["GET"]},
    ],
    "name": "procurement",
    "label": "Packlisty",
    "module": lazy(() => import(`./Packlists`)),
}