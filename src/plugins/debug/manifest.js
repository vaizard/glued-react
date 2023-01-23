import {lazy} from "react";


const approve = {
    "requiredResources": [],
    "name": "annotator",
    "label": "Anotátor",
    "module": lazy(() => import(`./Annotator`)),
}

export default {
    "requiredResources": [
        /*{name: "search_contact", methods: ["GET"]},
        {name: "annotate", methods: ["PUT", "POST"]},
        {name: "payment", methods: ["POST"]}*/
    ],
    "name": "annotator",
    "label": "Anotátor",
    "module": lazy(() => import(`./Annotator`)),
}