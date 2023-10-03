import Annotator from "../../plugins/annotator/manifest"
import Attachments from "../../plugins/debug/attachments.manifest"
import FakturX from "../../plugins/facturx/fakturx.manifest"

export default {
    "categories": {
    },
    "plugins": [
        {
            "path": "/annotator/create",
            "plugin": Annotator,
            "category": "finance"
        },
        {
            "path": "/debug/attachments",
            "plugin": Attachments,
            "category": "Debug"
        },
        {
            path: "/fakturx/manual",
            plugin: FakturX,
            category: "fenix"
        },

    ]
}