import {useEffect, useState} from "react";
import {FetchLikeFunction} from "../../AuthenticationContext";

// Defined because we will be shadowing real fetch later on
const realFetch = fetch

export function useData<K>(url?: string, fetchFunction?: FetchLikeFunction): K | null {
    const [data, setData] = useState<K | null>(null)
    const fetch = fetchFunction ?? realFetch


    useEffect(() => {
        if(url === undefined) {
            return
        }

        // This denotes whether the result of this effect is outdated or not
        let overriden = false
        let abortController = new AbortController()

        fetch(url, {signal: abortController.signal})
            .then(response =>  response.ok ? response.json() : null )
            .then(json => {
                if(!overriden) {
                    setData(json)
                }
            })


        return () => {overriden = true; abortController.abort()} // this is a function that gets executed when the effect is relaunched.
    }, [url])

    return data
}
