import * as pdf from "pdfjs-dist/build/pdf";
// noinspection ES6UnusedImports
import * as worker from "pdfjs-dist/build/pdf.worker.entry"

/**
 * Loads all attachments of a given file.
 * @param file A blob.
 * @returns {Promise<any>}
 */
const getPDFAttachment = async (file) => {
    const arrayBuffer = await file.arrayBuffer()
    let parsedPdf = await pdf.getDocument(arrayBuffer).promise
    return await parsedPdf.getAttachments()
}

export {getPDFAttachment}