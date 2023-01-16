import plugins from "../plugins.config";

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
 */
function filterRoutes(routes, endpoints) {
    let endpointsByName = groupEndpoints(endpoints);
    
    return Object.fromEntries(
        Object.entries(routes)
            .map(([key, it]) => {
                let clone = {...it}
                clone.children = clone.children.filter((it) => hasCorrectPermission(it, endpointsByName));
                console.log(clone)
                return [key, clone]
            }).filter(([key, it]) => it.children.length > 0)
    )
}

function hasCorrectPermission(plugin, endpointsByName) {
    console.log("Hello");
    for (let resource of plugin.requiredResources) {
        if(!endpointsByName.has(resource.name)) {
            console.log("False :(")
            console.log(plugin)
            return false;
        }
        const endpoint = endpointsByName(resource.name);
        for(const method of resource.methods) {
            if(!endpoint.methods.includes(method)) {
                console.log("False again :( " + method)
                console.log(plugin)
                return false
            }
        }
    }
    console.log("It's me")
    return true;
}

export { allInternalRoutes, filterRoutes }