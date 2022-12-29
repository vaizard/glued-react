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

const coreHelloPlugin = {
    "requiredResources": [
        // resource names required for this plugin to show up in menu
    ],
    "name": "A hello",
    "label": "Hello",
    //"module": lazy(() => import(`./Core`)),
    "module": lazy(
        () => import(`./Core`)
            .then(module => ({default: module.CoreHello}))
    ),
}

const authTestFailPlugin = {
        "requiredResources": [
            // resource names required for this plugin to show up in menu
        ],
        "name": "Testfail",
        "label": "Aut Tests Fail",
        //"module": lazy(() => import(`./Core`)),
        "module": lazy(
            () => import(`./Core`)
                .then(module => ({default: module.authTestFail}))
        ),
    }
;

export {coreHelloPlugin as CoreHello}
export {authTestFailPlugin as authTestFail}