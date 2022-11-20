import {lazy} from "react";


export default {
    "requiredResources": [
        // resource names required for this plugin to show up in menu
    ],
    "name": "rjsf-demo",
    "label": "Microsoft BOB",
    "module": lazy(() => import(`./PluginCalledBob`)),
}