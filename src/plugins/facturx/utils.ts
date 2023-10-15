import {sha256} from "js-sha256";


export const formatDate = (dateString: string) => {
    const year = dateString.slice(0, 4)
    const month = dateString.slice(4, 6)
    const day = dateString.slice(6, 8)
    return `${day}. ${month}. ${year}`
}

export function mapValues<V, T extends { [s: string]: V }, R>(obj: T, valueMapper: (value: V) => R) {
    return Object.fromEntries(
        Object.entries(obj).map(
            ([key, originalValue]) => [key, valueMapper(originalValue)]
        )
    )
}


// TODO: Generalize more
/**
 * @deprecated Use more generic multiGroup
 */
export function doubleGroup<T, A extends string, B extends string>(it: T[], major: (arg: T) => A, minor: (arg: T) => B) {
    return Object.fromEntries(
        Object.entries(groupBy(it, bill => major(bill)))
            .map(([key, value]) => [key, groupBy(value, value => minor(value))])
    )
}


function groupBy<T>(it: Array<T>, keySelector: (item: T) => string): {[key: string]: T[]} {
    const result: {[key: string]: T[]} = {}
    for(const i of it) {
        const key = keySelector(i)
        const array = result[key] ?? []
        array.push(i)
        result[key] = array
    }
    return result
}

export function multiGroup<K, V>(array: V[], keySelector: (val: V) => K) {
    const result: DeepMap<K, V[]> = new DeepMap()
    array.forEach(it => {
        const key = keySelector(it)
        const value = result.getOrPut(key, [])
        value.push(it)
        result.set(key, value)
    })

    return result
}

/**
 * This is here because JS doesn't have a good way of doing a real deepEquals :facepalm:
 */
function generateHashOfObject(x: any): string {
    return sha256(JSON.stringify(x))
}

export class DeepMap<K, V> {
    private keyMap = new Map<string, K>()
    private valMap = new Map<string, V>()

    get(key: K): V | undefined {
        const hash = generateHashOfObject(key)
        return this.valMap.get(hash)
    }

    set(key: K, value: V): void {
        const hash = generateHashOfObject(key)
        this.keyMap.set(hash, key)
        this.valMap.set(hash, value)
    }

    getOrPut(key: K, defaultValue: V): V {
        const result = this.get(key)
        if(result === undefined) {
            this.set(key, defaultValue)
            return defaultValue
        }
        return result
    }

    entries(): [K, V][] {
        const result: [K, V][] = [];
        for (const [hash, value] of this.valMap.entries()) {
            result.push([this.keyMap.get(hash)!!, value])
        }
        return result
    }

    mapValues<R>(valueMapper: (val: V) => R): DeepMap<K, R> {
        const result = new DeepMap<K, R>()
        for(const [key, value] of this.entries()) {
            const newValue = valueMapper(value)
            result.set(key, newValue)
        }
        return result;
    }

}

/**
 * To be used with `.filter()` to get rid of annoying typescript nulls.
 *
 * `array.filter(notNull)`
 */
export function notNull<TValue>(value: TValue | null | undefined): value is TValue {
    return value !== null && value !== undefined;
}

export function max(numbers: number[]) {
    let max = null
    for(const number of numbers) {
        if (max === null || max < number) {
            max = number
        }
    }
    return max
}