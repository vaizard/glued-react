import rjsf from "../../plugins/rjsf.manifest"
import procurement from "../../plugins/fare/procurement.manifest"
import skeleton from "../../plugins/skeleton.manifest"
import {CoreAuthDomains, CoreAuthUsers, CoreHello} from "../../plugins/core/core.manifest"
import CoreRoutes from "../../plugins/core/routes.manifest"
import CoreAuth from "../../plugins/core/coreauth.manifest"
import CoreHealth from "../../plugins/core/corehealth.manifest";
import Annotator from "../../plugins/annotator/manifest"
import Attachments from "../../plugins/debug/attachments.manifest"
import Products from "../../plugins/coffee/products.manifest"
import Packlists from "../../plugins/fare/packlists.manifest"
import FakturX from "../../plugins/facturx/fakturx.manifest"
import Analytics from "../../plugins/artman/manifest"
import TableDemo from "../../plugins/dev/table/manifest";

export default {
    "categories": {
        "core": {
            "label": "Core"
        },
        "debug": {
            "label": "Debug"
        },
        "skeleton": {
            "label": "Skeleton"
        },
        "finance": {
            "label": "Finance"
        },
        "devices": {
            "label": "Zdravotnické nástroje"
        },
        "coffee": {
            "label": "Kavárna"
        },
        "dev": {
            "label": "Development"
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
    {
        "path": "/debug/attachments",
        "plugin": Attachments,
        "category": "Debug"
    },
        {
            path: "/packlists",
            plugin: Packlists,
            category: "fare"
        },
        {
            path: "/coffee/products",
            plugin: Products,
            category: "coffee"
        },
        {
            path: "/fakturx/manual",
            plugin: FakturX,
            category: "fenix"
        },
        {
            path: "/analytics",
            plugin: Analytics,
            category: "fenix"
        },
        {
            path: "/dev/table",
            plugin: TableDemo,
            category: "dev"
        },

    ],

    // Development endpoints - made to be able to develop without waiting for Pavel to modify routes
    devEndpoints: [
        {
            "methods": [
                "GET"
            ],
            "name": "be_artman_analytics_v1",
            "url": "https://localhost.dev.anilez.cz/analytic",
        },
        {
            "methods": ["GET", "POST"],
            "name": "be_annotations_task_v1",
            "url": "https://localhost.dev.anilez.cz/annotation/tasks"
        },
        {
            "methods": ["GET"],
            "name": "contacts",
            "url": "https://localhost.dev.anilez.cz/contacts"
        }
    ]
}