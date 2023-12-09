

/**
 * Props passed to every Glued-React plugin by the plugin system
 */
export interface PluginProps {
    endpoints: Map<string, Endpoint>
}

type Method = "GET" | "POST" | "PUT" | "DELETE"

export interface Endpoint {
    url: string,
    methods: [Method],
    name: string,
}


//{"methods":["GET"],"name":"be_artman_analytics_v1","url":"https://gdev.industra.space/api/core/health/v1"}