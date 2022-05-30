import {lazy} from "react";

export default {
    "requiredResources": [
        // resource names required for this plugin to show up in menu
    ],
    "name": "enforce",
    "label": "Enforce",
    //"module": lazy(() => import(`./Core`)),
    "module": lazy(() => import(`./Core`)),
}

const anotherPlugin = {
    "requiredResources": [
        // resource names required for this plugin to show up in menu
    ],
    "name": "asdfghj",
    "label": "SomethingElse",
    //"module": lazy(() => import(`./Core`)),
    "module": lazy(
        () => import(`./Core`)
            .then(module => ({default: module.SomethingElse}))
    ),
};

export {anotherPlugin as SomethingElse}