import {lazy} from "react";

export default {
    "requiredResources": [
        /*{name: "search_contact", methods: ["GET"]},
        {name: "annotate", methods: ["PUT", "POST"]},
        {name: "payment", methods: ["POST"]}*/
        {name: "be_stor_annotations_v1", methods: ["PUT", "POST"]},
    ],
    "name": "annotator",
    "label": "Anotátor",
    "module": lazy(() => import(`./Annotator`)),
}