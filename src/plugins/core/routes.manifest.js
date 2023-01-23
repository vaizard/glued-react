import {lazy} from "react";

const coreRoutesPlugin = {
    "requiredResources": [
        // resource names required for this plugin to show up in menu
    ],
    "name": "Routes",
    "label": "Routes",
    "module": lazy(
        () => import(`./Routes`)
    ),
}

export default coreRoutesPlugin;