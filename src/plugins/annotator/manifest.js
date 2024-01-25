import {lazy} from "react";

export default {
    "requiredResources": [
        /*{name: "search_contact", methods: ["GET"]},
        {name: "annotate", methods: ["PUT", "POST"]},
        {name: "payment", methods: ["POST"]}*/
        {name: "be_annotations_task_v1", methods: ["GET", "POST"]},
        {name: "contacts", methods: ["GET"]},
    ],
    "name": "annotator",
    "label": "Anotátor",
    "module": lazy(() => import(`./Annotator`)),
}