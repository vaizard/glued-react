

export const formatDate = (dateString: string) => {
    const year = dateString.slice(0, 4)
    const month = dateString.slice(4, 6)
    const day = dateString.slice(6, 8)
    return `${day}. ${month}. ${year}`
}