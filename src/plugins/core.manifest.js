import {lazy} from "react";

const coreHelloPlugin = {
    "requiredResources": [
        {name: "asdf", methods: ["GET"]}
    ],
    "name": "A hello",
    "label": "Hello",
    //"module": lazy(() => import(`./Core`)),
    "module": lazy(
        () => import(`./Core`)
            .then(module => ({default: module.CoreHello}))
    ),
}

const coreRoutesPlugin = {
        "requiredResources": [
            // resource names required for this plugin to show up in menu
        ],
        "name": "Routes",
        "label": "Routes",
        //"module": lazy(() => import(`./Core`)),
        "module": lazy(
            () => import(`./CoreRoutes`)
        ),
    }

const coreAuthUsersPlugin = {
        "requiredResources": [
            // resource names required for this plugin to show up in menu
        ],
        "name": "Users",
        "label": "Users",
        //"module": lazy(() => import(`./Core`)),
        "module": lazy(
            () => import(`./Core`)
                .then(module => ({default: module.CoreHello}))
        ),
    }

const coreAuthDomainsPlugin = {
        "requiredResources": [
            // resource names required for this plugin to show up in menu
        ],
        "name": "Domains",
        "label": "Domains",
        //"module": lazy(() => import(`./Core`)),
        "module": lazy(
            () => import(`./Core`)
                .then(module => ({default: module.CoreHello}))
        ),
    }


;


export {coreHelloPlugin as CoreHello}
export {coreRoutesPlugin as CoreRoutes}
export {coreAuthUsersPlugin as CoreAuthUsers}
export {coreAuthDomainsPlugin as CoreAuthDomains}