import React, {ReactElement} from "react";
import {sha256} from "js-sha256";
import {formatDate} from "./utils";
import {Tooltip} from "@mui/material";

const MAX_SVG = 1401

interface OrderMojiProps { invoice: string | undefined, date: string | undefined }

export default function OrderMoji({invoice, date}: OrderMojiProps): ReactElement {
    if(invoice == undefined || date == undefined ) {
        return <></>
    }
    const hash = sha256(invoice + date).slice(-6)

    const emojiOrdinal = parseInt(hash, 16) % MAX_SVG
    const emojiUrl = process.env.PUBLIC_URL + '/emoji/' + emojiOrdinal + '.svg';
    const humanName = `${invoice} ze dne ${formatDate(date)}`

    return <Tooltip arrow={true} title={ humanName } >
        <img style={ { display: "inline-block", height: "2em" } } alt={humanName} src={emojiUrl} />
    </Tooltip>
}

export function humanName(invoice: string | undefined, date: string | undefined): string {
    return `${invoice ?? "-"} ze dne ${date === undefined ? "-" : formatDate(date)}`
}