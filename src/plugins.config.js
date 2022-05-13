import rjsf from "./plugins/rjsf.manifest"
import skeleton from "./plugins/skeleton.manifest"

export default {
    "categories": {
        "lab": {
            "label": "Industra Lab"
        }
    },
    "plugins": [{
        "path": "/rjsf",
        "plugin": rjsf,
        "category": "lab"
    },
    {
        "path": "/skeleton",
        "plugin": skeleton,
        "category": "lab"
    }
    ]
}