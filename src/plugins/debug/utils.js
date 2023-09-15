

export const downloadBlob = (blob, name) => {
    const a = document.createElement("a")
    const url = URL.createObjectURL(blob)
    a.href = url
    a.download = name
    a.click()

    setTimeout(() => {URL.revokeObjectURL(url)}, 10000)

}

export const downloadUnit8Array = (array, name) => (
    downloadBlob(new Blob([array]), name)
)
