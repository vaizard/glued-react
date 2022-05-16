import rjsf from "./plugins/rjsf.manifest"
import skeleton from "./plugins/skeleton.manifest"
import core from "./plugins/core.manifest"

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
        "path": "/skeleton",
        "plugin": skeleton,
        "category": "skeleton"
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
        "path": "/core/auth/test/pass",
        "plugin": core,
        "category": "core"
    },
    {
        "path": "/core/auth/test/fail",
        "plugin": core,
        "category": "core"
    },
    {
        "path": "/core/health",
        "plugin": core,
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