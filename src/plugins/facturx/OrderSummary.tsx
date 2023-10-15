import React from "react";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import {InvoiceViewerProps, itemize, unpack} from "./InvoiceViewer";
import {cz} from "@fakturx/fakturx-parser";
import {multiGroup, notNull} from "./utils";
import OrderMoji, {humanName} from "./OrderMoji";
import Stack from "@mui/material/Stack";
import Billable = cz.vybehpelikanu.fakturx.fold.Billable;
import Money = cz.vybehpelikanu.fakturx.money.Money;
import BuyerOrder = cz.vybehpelikanu.fakturx.fold.BuyerOrder;


export default function OrderSummary(props: InvoiceViewerProps): JSX.Element {
    const data = unpack(props.invoice)
    const rows = summarize(data)
    const columns: GridColDef<Summary>[]  = [
        { headerName: 'Objednávka', width: 500, valueGetter: ({row}) => humanName(row.order.number, row.order.date), type: "string", field: "order", renderCell: ({row}) => <SmallOrderMoji order={row.order}/> },
        { headerName: 'DPH', width: 100, valueGetter: (params) => params.row.vat, type: "number", field: "vat", renderCell: ({value}) => `${value} %` },
        { headerName: 'Celkem', width: 150, valueGetter: (params) => params.row.total, type: "string", field: "total", renderCell: ({value}) => (value ?? "-").toString()},
    ];

    return <DataGrid rows={rows} columns={columns} getRowId={it => `${it.order}-${it.vat}`}/>

}

function SmallOrderMoji({order}: { order?: BuyerOrder }) {
    if(order == undefined) {
        return <></>
    }
    return <Stack direction="row" gap={2} alignItems="center">
        <OrderMoji invoice={order.number} date={order.date} />
        {humanName(order.number, order.date)}
    </Stack>
}
interface Summary {
    order: BuyerOrder,
    vat: number | null,
    total: Money | null
}

function summarize(data: Billable[]): Summary[] {

    const betterSummary = multiGroup(data, (it: Billable) =>
        ({order: itemize(it)?.orderReference ?? null, vat: itemize(it)?.fenixVATRate ?? null })
    )

    let mapped = betterSummary.mapValues(it =>
        it
            .map(it => itemize(it))
            .filter(notNull)
            .map(it => it.totalPrice )
            .reduce((a: Money | null, b: Money) => a?.plus(b) ?? b, null)

    );

    return mapped.entries().map(([k, v]) => {
        const r = k as any
        r['total'] = v
        return r as Summary
    })


}