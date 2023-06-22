import rjsf from "./plugins/rjsf.manifest"
import procurement from "./plugins/fare/procurement.manifest"
import skeleton from "./plugins/skeleton.manifest"
import {CoreHello, CoreAuthUsers, CoreAuthDomains} from "./plugins/core/core.manifest"
import CoreRoutes from "./plugins/core/routes.manifest"
import CoreAuth from "./plugins/core/coreauth.manifest"
import CoreHealth from "./plugins/core/corehealth.manifest";
import Annotator from "./plugins/annotator/manifest"

export default {
    "categories": {
        "core": {
            "label": "Core"
        },
        "skeleton": {
            "label": "Skeleton"
        },
        "finance": {
            "label": "Finance"
        },
        "devices": {
            "label": "Zdravotnické nástroje"
        }
    },
    "plugins": [
    {
        "path": "/skeleton/rjsf",
        "plugin": rjsf,
        "category": "skeleton"
    },
    {
        "path": "/procurement",
        "plugin": procurement,
        "category": "devices"
    },
    {
        "path": "/annotator/create",
        "plugin": Annotator,
        "category": "finance"
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