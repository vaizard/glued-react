




const first = (pavelArray) => (
    pavelArray?.[0]?.val
)



const searchResultToSomethingFuckingNormal = it =>
    it.map(it => ({
        id: it.uuid,
        name: first(it.name),
        ico: it.regid?.val,
        dic: it.vatid?.val,
        address: first(it.address),
    }))


export {searchResultToSomethingFuckingNormal}