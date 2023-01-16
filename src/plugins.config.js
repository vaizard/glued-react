import rjsf from "./plugins/rjsf.manifest"
import skeleton from "./plugins/skeleton.manifest"
import {CoreHello, CoreRoutes, CoreAuthUsers, CoreAuthDomains} from "./plugins/core.manifest"
import bob from "./plugins/bob.manifest"
import CoreAuth from "./plugins/coreauth.manifest"
import CoreHealth from "./plugins/corehealth.manifest";

export default {
    "categories": {
        "core": {
            "label": "Core"
        },
        "skeleton": {
            "label": "Skeleton"
        }
    },
    "plugins": [
    {
        "path": "/skeleton/rjsf",
        "plugin": rjsf,
        "category": "skeleton"
    },
    {
        "path": "/bob",
        "plugin": bob,
        "category": "skeleton"
    },
    {
        "path": "/skeleton",
        "plugin": skeleton,
        "category": "skeleton"
    },
    {
        "path": "/core/hello",
        "plugin": CoreHello,
        "category": "core"
    },
    {
        "path": "/core/auth/users",
        "plugin": CoreAuthUsers,
        "category": "core"
    },
    {
        "path": "/core/auth/domains",
        "plugin": CoreAuthDomains,
        "category": "core"
    },
    {
        "path": "/core/auth/status",
        "plugin": CoreAuth,
        "category": "core"
    },
    {
        "path": "/core/health",
        "plugin": CoreHealth,
        "category": "core"
    },
    {
        "path": "/core/routes",
        "plugin": CoreRoutes,
        "category": "core"
    },

    ]
}