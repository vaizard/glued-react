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

    ],
    devEndpoints: [
        {
            "methods": ["GET"],
            "name": "be_artman_analytics_v1",
            "url": "https://artman.internal.kompresorovna.anilez.cz/analytic",
        },
        {
            "methods": ["GET", "POST"],
            "name": "be_annotations_task_v1",
            "url": "https://artman.internal.kompresorovna.anilez.cz/annotation/tasks"
        },
        {
            "methods": ["GET"],
            "name": "contacts",
            "url": "https://artman.internal.kompresorovna.anilez.cz/contacts"
        }
    ]
}