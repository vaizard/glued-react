import {cz} from "@fakturx/fakturx-parser";
import Stack from "@mui/material/Stack";
import {ToggleButton, ToggleButtonGroup, Tooltip} from "@mui/material";
import React, {ReactElement, useState} from "react";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import Invoice = cz.vybehpelikanu.fakturx.fold.Invoice;
import Billable = cz.vybehpelikanu.fakturx.fold.Billable;
import Compound = cz.vybehpelikanu.fakturx.fold.Compound;
import CalculatedPrice = cz.vybehpelikanu.fakturx.fold.CalculatedPrice;
import Item = cz.vybehpelikanu.fakturx.fold.Item;
import { sha256 } from 'js-sha256';
import BuyerOrder = cz.vybehpelikanu.fakturx.fold.BuyerOrder;
import {formatDate} from "./utils";
import hsCodes from "./hsCodes.json";
import IconButton from "@mui/material/IconButton";
import CloseIcon from '@mui/icons-material/Close';


export default function InvoiceViewer({invoice, onClose}: InvoiceViewerProps) : ReactElement {
    const [view, setView] = useState<ViewType>("pricing")
    return <Stack>
        <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center">
            <ToggleButtonGroup
                color="primary"
                value={ view }
                exclusive
                onChange={ (_, value) => setView(value) }
            >
                <ToggleButton value="pricing">Ceny</ToggleButton>
                <ToggleButton value="customs">Dovoz</ToggleButton>
            </ToggleButtonGroup>
            { onClose !== undefined && <IconButton onClick={onClose}><CloseIcon/></IconButton> }
        </Stack>
        <div style={{ height: 800, width: '100%' }}>
            { view == "pricing" && <PricingView invoice={invoice} /> }
            { view == "customs" && <CustomsView invoice={invoice} /> }
        </div>

    </Stack>
}

const MAX_SVG = 1401

interface OrderMojiProps { invoice: string | undefined, date: string | undefined }

function OrderMoji({invoice, date}: OrderMojiProps): ReactElement {
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



export function PricingView(props: InvoiceViewerProps): ReactElement {
    const lines = createRows(props.invoice)
    const rows = fillGaps(lines)

    const columns: GridColDef<BillableLine>[] = [
        { headerName: '#', width: 100, valueGetter: ({row}) => row.line, type: "string", field: "line" },
        { headerName: 'Obj', width: 50, valueGetter: ({row}) => orderToString(asItem(row)?.orderReference), type: "string", field: "order", renderCell: ({row}) => <OrderMoji invoice={asItem(row)?.orderReference?.number} date={asItem(row)?.orderReference?.date} />},
        { headerName: 'SKU', width: 120, valueGetter: ({row}) => asItem(row)?.sku, type: "string", field: "sku" },
        { headerName: 'Sériová čísla', width: 120, valueGetter: ({row}) => asItem(row)?.serialNumbers, type: "string", field: "serialNumbers" },
        { headerName: 'Název', width: 350, valueGetter: ({row}) => asItem(row)?.name, type: "string", field: "name" },
        { headerName: 'Počet', width: 50, valueGetter: ({row}) => asItem(row)?.count, type: "number", field: "count" },
        { headerName: 'Jednotková cena', width: 150, valueGetter: ({row}) => ( getPricePerUnit(asItem(row))?.grossPrice ), type: "string", field: "grossPrice" },
        { headerName: 'Konečná cena', width: 150, valueGetter: ({row}) => ( getPricePerUnit(asItem(row))?.total ), type: "string", field: "unitPrice" },
    ];


    return <DataGrid rows={rows} columns={columns} getRowId={it => it.number}/>

}

const orderToString = (order: BuyerOrder | null | undefined) => order != null ? order.number + order.date : null

export function CustomsView(props: InvoiceViewerProps): JSX.Element {
    const data = unpack(props.invoice)
    const rows = summarize(data)
    const columns: GridColDef<Summary>[]  = [
        { headerName: 'Země', width: 100, valueGetter: (params) => params.row.countryOfOrigin, type: "string", field: "country" },
        { headerName: 'Kód', width: 150, valueGetter: (params) => params.row.customsCode, type: "string", field: "hscode" },
        { headerName: 'Název', width: 600, valueGetter: (params) => params.row.customsName, type: "string", field: "hsname" },
        { headerName: 'Váha (g)', width: 100, valueGetter: (params) => params.row.weight, renderCell: (params) => params.value + " g",  type: "number", field: "weight" },
    ];

    return <DataGrid rows={rows} columns={columns} getRowId={it => it.countryOfOrigin + it.customsCode}/>

}

export interface InvoiceViewerProps {
    invoice: Invoice,
    onClose?: () => void
}

type ViewType = "pricing" | "customs"

interface Numbered { number: number }

type NumberedBillable = Billable & Numbered

function createRows(invoice: Invoice): NumberedBillable[] {
    return unpack(invoice).map((it, index) => {
        // @ts-ignore
        it["number"] = index
        return it as NumberedBillable
    } )
}

type InvalidLine = Numbered & {
    line: string
}

type BillableLine = NumberedBillable | InvalidLine

function asBillable(line: BillableLine): NumberedBillable | null {
    return line instanceof Billable ? line : null
}

function fillGaps(original: NumberedBillable[]): BillableLine[] {
    if(original.length == 0) {
        return []
    }
    const result: BillableLine[] = []
    let index: number | null = null
    for(let line of original) {
        const lineString = line?.line
        const actualLineNumber = lineString == null ? null : parseInt(lineString, 10)
        const expectedLineNumber = index == null ? null : index + 1;
        if(actualLineNumber != null && expectedLineNumber != null && expectedLineNumber < actualLineNumber) {
            for(let i = expectedLineNumber; i < actualLineNumber; i++) {
                result.push({line: "Missing " + i, number: -i})
            }
        }

        index = actualLineNumber
        result.push(line)
    }

    return result
}

function unpack(it: Billable): Billable[] {
    if(it instanceof Compound) {
        return it.children.toArray().flatMap((it: Billable) => unpack(it))
    }
    return [it]

}

function getPricePerUnit(billable: Billable | null): CalculatedPrice | null {
    if(billable instanceof Item) {
        return billable.pricePerUnit
    }
    return null
}

interface Summary {
    weight: number,
    customsCode: string,
    countryOfOrigin: string,
    customsName: string | undefined
}

// Todo: use items
function summarize(it: Billable[]): Summary[] {
    const grouped = Object.fromEntries(
        Object.entries(groupBy(it, bill => itemize(bill)?.countryCode ?? ""))
            .map(([key, value]) => [key, groupBy(value, value => itemize(value)?.customsCode ?? "")])
    )

    return Object.entries(grouped).flatMap(([country, obj]) =>
        Object.entries(obj).map(([customsCode, items]) => {
            const sum = items
                .map(it => itemize(it))
                .map(it => (it?.count ?? 1) * (it?.gramsPerUnit ?? 0))
                .reduce((partialSum, a) => partialSum + a, 0)
            return {countryOfOrigin: country, customsCode: customsCode, customsName: hsCodes[customsCode as keyof typeof hsCodes]?.nameCZ, weight: sum}
        })
    )


}

function asItem(it: BillableLine) {
    const billable = asBillable(it)
    return billable && itemize(billable)
}

function itemize(it: Billable): Item | null {
    return it instanceof Item ? it : null
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