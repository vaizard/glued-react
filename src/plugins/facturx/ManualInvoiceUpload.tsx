import DropBox from "../../components/DropBox";
import React, {useState} from "react";
import {parseAttachment, selectAttachment} from "./parser";
import {getPDFAttachment} from "../debug/pdf/pdf";
import {cz} from "@fakturx/fakturx-parser";
import CenteredLoader from "../../tools/CenteredLoader";
import InvoiceViewer from "./InvoiceViewer";
import Invoice = cz.vybehpelikanu.fakturx.fold.Invoice;


export default function ManualInvoiceUpload(): JSX.Element {
    const [files, setFile] = useState<File[] | null>(null)
    const [invoice, setInvoice] = useState<Invoice | null>(null)

    const handleFileChange = async (files: File[] | null)=> {
        setFile(files)
        setInvoice(null)
        if(files?.[0] == undefined) {
            return
        }

        const attachments = (await Promise.all(files.map(it => getPDFAttachment(it)))).flatMap(Object.entries)
        const attachment = selectAttachment(attachments)
        const invoice = parseAttachment(attachment)
        setInvoice(invoice)
    }

    if (files === null) {
        return <DropBox onDrop={x => handleFileChange(x)}/>
    }

    if(invoice == null) {
        return <CenteredLoader />;
    }

    return <InvoiceViewer invoice={invoice} onClose={() => setFile(null)}/>

}

