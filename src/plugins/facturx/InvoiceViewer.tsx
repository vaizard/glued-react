import {cz} from "@fakturx/fakturx-parser";
import Invoice = cz.vybehpelikanu.fakturx.fold.Invoice;
import Stack from "@mui/material/Stack";
import {ToggleButton, ToggleButtonGroup} from "@mui/material";
import React, {useState} from "react";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import Billable = cz.vybehpelikanu.fakturx.fold.Billable;
import Compound = cz.vybehpelikanu.fakturx.fold.Compound;
import CalculatedPrice = cz.vybehpelikanu.fakturx.fold.CalculatedPrice;
import Item = cz.vybehpelikanu.fakturx.fold.Item;


export default function InvoiceViewer({invoice}: InvoiceViewerProps) : JSX.Element {
    const [view, setView] = useState<ViewType>("pricing")
    return <Stack>
        <ToggleButtonGroup
            color="primary"
            value={ view }
            exclusive
            onChange={ (_, value) => setView(value) }
        >
            <ToggleButton value="pricing">Ceny</ToggleButton>
            <ToggleButton value="customs">Dovoz</ToggleButton>
        </ToggleButtonGroup>
        <div style={{ height: 800, width: '100%' }}>
            { view == "pricing" && <PricingView invoice={invoice} /> }
            { view == "customs" && <CustomsView invoice={invoice} /> }
        </div>

    </Stack>
}

export function PricingView(props: InvoiceViewerProps): JSX.Element {
    const rows: NumberedBillable[] = createRows(props.invoice)

    const columns: GridColDef<NumberedBillable>[] = [
        { headerName: '#', width: 100, valueGetter: (params) => params.row.line, type: "string", field: "line" },
        { headerName: 'Název', width: 300, valueGetter: (params) => params.row.name, type: "string", field: "name" },
        { headerName: 'Počet', width: 100, valueGetter: (params) => params.row.count, type: "number", field: "count" },
        { headerName: 'Jednotková cena', width: 150, valueGetter: ({row}) => ( getPricePerUnit(row)?.grossPrice ), type: "string", field: "grossPrice" },
        { headerName: 'Konečná cena', width: 150, valueGetter: ({row}) => ( getPricePerUnit(row)?.total ), type: "string", field: "unitPrice" },
        { headerName: 'Konečná cena', width: 150, valueGetter: ({row}) => ( getPricePerUnit(row)?.total ), type: "string", field: "unitPrice" }
    ];


    return <DataGrid rows={rows} columns={columns} getRowId={it => it.number}/>

}

export function CustomsView(props: InvoiceViewerProps): JSX.Element {
    const data = unpack(props.invoice)
    const rows = summarize(data)
    const columns: GridColDef<Summary>[]  = [
        { headerName: 'Země', width: 100, valueGetter: (params) => params.row.countryOfOrigin, type: "string", field: "country" },
        { headerName: 'Kód', width: 300, valueGetter: (params) => params.row.customsCode, type: "string", field: "hscode" },
        { headerName: 'Váha (g)', width: 200, valueGetter: (params) => params.row.weight, renderCell: (params) => params.value + " g",  type: "number", field: "weight" },
    ];

    return <DataGrid rows={rows} columns={columns} getRowId={it => it.countryOfOrigin + it.customsCode}/>

}

interface InvoiceViewerProps {
    invoice: Invoice
}

type ViewType = "pricing" | "customs"

type NumberedBillable = Billable & { number: number }

function createRows(invoice: Invoice): NumberedBillable[] {
    return unpack(invoice).map((it, index) => {
        // @ts-ignore
        it["number"] = index
        return it as NumberedBillable
    } )
}

function unpack(it: Billable): Billable[] {
    if(it instanceof Compound) {
        return it.children.toArray().flatMap((it: Billable) => unpack(it))
    }
    return [it]

}

function getPricePerUnit(billable: Billable): CalculatedPrice | null {
    if(billable instanceof Item) {
        return billable.pricePerUnit
    }
    return null
}

interface Summary {
    weight: number,
    customsCode: string,
    countryOfOrigin: string,
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
            return {weight: sum, customsCode: customsCode, countryOfOrigin: country}
        })
    )


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