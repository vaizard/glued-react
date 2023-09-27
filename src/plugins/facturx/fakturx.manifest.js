import {lazy} from "react";


export default {
    "requiredResources": [
    ],
    "name": "manualFakturX",
    "label": "Manuální načtení faktury",
    "module": lazy(() => import(`./ManualInvoiceUpload`)),
}