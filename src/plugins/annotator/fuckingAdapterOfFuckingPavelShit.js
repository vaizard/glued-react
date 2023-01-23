



const pavelObjectToNormalArray = pavelObject => Object.entries(pavelObject).map(([key, value]) => ({
        ...value,
        uuid: key
    }
));

const useFirst = (pavelArray) => (
    pavelArray?.[0]?.value
)



const searchResultToSomethingFuckingNormal = input =>
    pavelObjectToNormalArray(input)
        .map( it => ({
            id: it.uuid,
            name: useFirst(it.name),
            ico: useFirst(it.regid),
            dic: useFirst(it.vatid),
            address: useFirst(it.address),
            account: null // TODO: az to Pavel naimplementuje
        }));


export {searchResultToSomethingFuckingNormal}