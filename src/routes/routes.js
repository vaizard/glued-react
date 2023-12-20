import plugins from "../configs/used/plugins.config";

let allInternalRoutes = {};

function createRoutesCategory(categories, categoryName){
    categoryName = categoryName ?? "";
    if (!(categoryName in categories) ) {
        categoryName = ""
    }

    if (categoryName in allInternalRoutes) {
        return allInternalRoutes[categoryName];
    }

    allInternalRoutes[categoryName] = {
        children: []
    };

    const label = categories[categoryName]?.label;

    if(label !== null){
        allInternalRoutes[categoryName].label  = label
    }

    return allInternalRoutes[categoryName];

}


for (let plugin of plugins.plugins ?? []) {

    let category = createRoutesCategory(plugins.categories, plugin?.category ?? null);
    category.children.push({
        name: plugin.plugin.name,
        label: plugin.plugin.label,
        // WebPack doesn't support full dynamic imports :facepalm:
        element: plugin.plugin.module,
        path: plugin.path,
        requiredResources: plugin.plugin.requiredResources
    })

}

/**
 * Associate endpoints by their names.
 */
function groupEndpoints(endpoints) {
    let result = new Map();
    for(const endpoint of endpoints) {
        result.set(endpoint.name, endpoint)
    }
    return result
}

/**
 * Filters internal routes based on API endpoints available to the user.
 * Access is determined by the server.
 *
 * @param endpoints Object of endpoints from server associated by name.
 *      You can use groupEndpoints() function to get such object.
 * @param routes All available routes on client. Usually can be retrieved from variable allInternalRoutes
 */
function filterRoutes(routes, endpoints) {

    return Object.fromEntries(
        Object.entries(routes)
            .map(([key, it]) => {
                let clone = {...it}
                clone.children = clone.children.filter((it) => hasCorrectPermission(it, endpoints));
                return [key, clone]
            }).filter(([_, it]) => it.children.length > 0)
    )
}

function hasCorrectPermission(plugin, endpointsByName) {
    for (let resource of plugin.requiredResources) {
        if(!endpointsByName.has(resource.name)) {
            return false;
        }
        const endpoint = endpointsByName.get(resource.name);
        for(const method of resource.methods) {
            if(!endpoint.methods.includes(method)) {
                return false
            }
        }
    }
    return true;
}

export { allInternalRoutes, filterRoutes, groupEndpoints }