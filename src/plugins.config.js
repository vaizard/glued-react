import rjsf from "./plugins/rjsf.manifest"
import skeleton from "./plugins/skeleton.manifest"
import core, {CoreHello, authTestFail} from "./plugins/core.manifest"
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
        "path": "/core/status/jwt/fetch",
        "plugin": core,
        "category": "core"
    },
    {
        "path": "/core/status/jwt/decode",
        "plugin": core,
        "category": "core"
    },
    {
        "path": "/core/status/auth",
        "plugin": core,
        "category": "core"
    },
    {
        "path": "/core/signin",
        "plugin": core,
        "category": "core"
    },
    {
        "path": "/core/signout",
        "plugin": core,
        "category": "core"
    },
    {
        "path": "/core/auth/users",
        "plugin": core,
        "category": "core"
    },
    {
        "path": "/core/auth/domains",
        "plugin": core,
        "category": "core"
    },
    {
        "path": "/core/auth/test",
        "plugin": CoreAuth,
        "category": "core"
    },
    {
        "path": "/core/auth/test/fail",
        "plugin": authTestFail,
        "category": "core"
    },
    {
        "path": "/core/health",
        "plugin": CoreHealth,
        "category": "core"
    },
    {
        "path": "/core/routes/list",
        "plugin": core,
        "category": "core"
    },
    {
        "path": "/core/routes/tree",
        "plugin": core,
        "category": "core"
    },


    ]
}