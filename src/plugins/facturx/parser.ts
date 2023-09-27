import {cz} from "@fakturx/fakturx-parser";
// noinspection ES6UnusedImports
import Invoice = cz.vybehpelikanu.fakturx.fold.Invoice;
import FakturXtest = cz.vybehpelikanu.fakturx.FakturXtest;

export function parseAttachment(file: any): Invoice {
    const decoder = new TextDecoder()
    const xmlParser = new FakturXtest()
    const xml = decoder.decode(file.content)
    return xmlParser.parseXml(xml)

}

const known_names = ["faktur-x.xml"]

/**
 * Takes an array of attachments and returns the one that should most likely be FakturX xml.
 * @param attachments an object returned by pdf.js
 */
export function selectAttachment(attachments: [string, any][] | null) {
    if(attachments === null) {
        return null
    }

    let found = attachments.find(([name, _]) => known_names.includes(name.toLowerCase()))
    if(found !== undefined) {
        return found[1]
    }

    found = attachments.find(([name, _]) => name.toLowerCase().endsWith(".xml"))

    if(found !== undefined) {
        return found[1]
    }

    return null
}