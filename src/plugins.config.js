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
        "path": "/core/auth",
        "plugin": core,
        "category": "core"
    }

    ]
}