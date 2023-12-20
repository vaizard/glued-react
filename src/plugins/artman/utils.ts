import {useEffect, useState} from "react";
import {FetchLikeFunction} from "../../AuthenticationContext";

// Defined because we will be shadowing real fetch later on
const realFetch = fetch

export function useData<K>(url?: string, fetchFunction?: FetchLikeFunction): [K | null, boolean, () => void] {
    const [data, setData] = useState<K | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [version, setVersion] = useState(1)
    const refresh = () => {setVersion((version) => version + 1)}
    const fetch = fetchFunction ?? realFetch


    useEffect(() => {
        if(url === undefined) {
            return
        }

        // This denotes whether the result of this effect is outdated or not
        let overriden = false
        let abortController = new AbortController()

        setLoading(true)

        // TODO: there is no catch
        fetch(url, {signal: abortController.signal})
            .then(response =>  response.ok ? response.json() : null )
            .then(json => {
                if(!overriden) {
                    setData(json)
                    setLoading(false)
                }
            })


        return () => {overriden = true; abortController.abort()} // this is a function that gets executed when the effect is relaunched.
    }, [url, version])

    return [data, loading, refresh]
}

export const addTrailingSlash = (url: string) => {
    if(url.endsWith("/")) {
        return url
    }
    return `${url}/`
}

export const relative = (endpoint: string, path: string) => {
    return new URL(path, addTrailingSlash(endpoint))
}

export class RemoteRequestException extends Error {
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
    }
}
