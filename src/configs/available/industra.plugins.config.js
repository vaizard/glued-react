import Annotator from "../../plugins/annotator/manifest"
import Products from "../../plugins/coffee/products.manifest"

export default {
    "categories": {
        "finance": {
            "label": "Finance"
        },
        "coffee": {
            "label": "Kavárna"
        }
    },
    "plugins": [
        {
            "path": "/annotator/create",
            "plugin": Annotator,
            "category": "finance"
        },
        {
            path: "/coffee/products",
            plugin: Products,
            category: "coffee"
        },

    ]
}