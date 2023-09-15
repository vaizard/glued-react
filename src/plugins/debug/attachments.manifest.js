import {lazy} from "react";


export default {
    "requiredResources": [
    ],
    "name": "attachments",
    "label": "PDF přílohy",
    "module": lazy(() => import(`./PDFAttachments`)),
}