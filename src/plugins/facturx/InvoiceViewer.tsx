import {cz} from "@fakturx/fakturx-parser";
import Stack from "@mui/material/Stack";
import {ToggleButton, ToggleButtonGroup} from "@mui/material";
import React, {ReactElement, useState} from "react";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import hsCodes from "./hsCodes.json";
import IconButton from "@mui/material/IconButton";
import CloseIcon from '@mui/icons-material/Close';
import OrderMoji from "./OrderMoji";
import OrderSummary from "./OrderSummary";
import {DeepMap, doubleGroup, max, multiGroup, notNull} from "./utils";
import {sha256} from "js-sha256";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import AlertTitle from "@mui/material/AlertTitle";
import Invoice = cz.vybehpelikanu.fakturx.fold.Invoice;
import Billable = cz.vybehpelikanu.fakturx.fold.Billable;
import Compound = cz.vybehpelikanu.fakturx.fold.Compound;
import CalculatedPrice = cz.vybehpelikanu.fakturx.fold.CalculatedPrice;
import Item = cz.vybehpelikanu.fakturx.fold.Item;
import BuyerOrder = cz.vybehpelikanu.fakturx.fold.BuyerOrder;
import DiscountReason = cz.vybehpelikanu.fakturx.fold.discounts.DiscountReason;
import ChargeOrDiscount = cz.vybehpelikanu.fakturx.fold.discounts.ChargeOrDiscount;
import Money = cz.vybehpelikanu.fakturx.money.Money;


function InvalidInvoiceWarning(props: {
    onClose?: () => void; onAccept?: () => void, expected: Money, actual: Money
}) {

    return <Alert
        severity="warning"
        action={
            <Stack gap={1} direction="row" alignItems={"center"}>
                <Button color="inherit" size="small" onClick={props.onAccept}>
                    RISKNU TO, ZOBRAZ FAKTURU
                </Button>
                <IconButton color="inherit" size="small" onClick={props.onClose}>
                    <CloseIcon />
                </IconButton>
            </Stack>
        }
    >
        <AlertTitle>Chybné součty</AlertTitle>
        Pozor! Výpočet Fénixu nesedí s výpočtem KLS! Faktury se liší o { props.expected.minus(props.actual).toString() }!
        Data zobrazená v aplikaci mohou být zkreslená, doporučujeme fakturu přepočítat ručně!
    </Alert>
}

export default function InvoiceViewer({invoice, onClose}: InvoiceViewerProps) : ReactElement {
    const [view, setView] = useState<ViewType>( invoice.expectedTotal.equals(invoice.totalPrice) ? "pricing" : "invalid")
    if(view == "invalid") {
        return <InvalidInvoiceWarning onClose={onClose} onAccept={() => setView("pricing")} expected={invoice.expectedTotal} actual={invoice.totalPrice} />
    }
    return <Stack sx={{flex: 1, height: '100%'}}>
        <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center">
            <ToggleButtonGroup
                color="primary"
                value={ view }
                exclusive
                onChange={ (_, value) => setView(value) }
            >
                <ToggleButton value="pricing">Ceny</ToggleButton>
                <ToggleButton value="customs">Dovoz</ToggleButton>
                <ToggleButton value="overview">Přehled</ToggleButton>
            </ToggleButtonGroup>
            { onClose !== undefined && <IconButton onClick={onClose}><CloseIcon/></IconButton> }
        </Stack>
        <div style={{ flex: 1, width: '100%', minHeight: 0 }}>
            { view == "pricing" && <PricingView invoice={invoice} /> }
            { view == "customs" && <CustomsView invoice={invoice} /> }
            { view == "overview" && <OrderSummary invoice={invoice} /> }
        </div>

    </Stack>
}

interface Hashable {
    hashCode(): number,
    equals(other: any): boolean
}

function sumByHash<T extends Hashable>(original: T[]) {
    let intermediate: Map<number, [T, number][]> = new Map()
    for(const item of original) {
        const hash = item.hashCode()
        const array = intermediate.get(hash) ?? []
        let newMember = array.find(it => it[0].equals(item))
        if(newMember === undefined) {
            newMember = [item, 0]
            array.push(newMember)
        }
        newMember[1] = newMember[1] + 1

        intermediate.set(hash, array)
    }
    return Array.from(intermediate.values()).flatMap(it => it)
}

const reasonNames = {
    "LineDiscount": "Řádková sleva",
    "InvoiceDiscount": "Sleva na fakturu",
    "Sconto": "Sconto",
    "Other": "Jiné",
}

function getDiscountName(reason: DiscountReason) {
    return reasonNames[reason.type.name] ?? "Jiné"
}

function findChargeByReason<T extends ChargeOrDiscount>(discounts: T[], discount: cz.vybehpelikanu.fakturx.fold.discounts.DiscountReason, index: number): T | undefined {
    const matching = discounts.filter(it => it.reason.equals(discount))
    return matching[index]
}

function getDiscountContent(line: BillableLine, discount: DiscountReason, index: number) {
    const charges = getPricePerUnit(asItem(line))?.chargesArray
    if(charges === undefined) { return null }
    return findChargeByReason(charges, discount, index) ?? null

}

function createChargeColumns(requiredChargeColumns: DeepMap<DiscountReason, number>): GridColDef<BillableLine>[] {
    return requiredChargeColumns.entries().flatMap(([reason, count]) => {
        let result: GridColDef<BillableLine>[] = []
        for(let i = 0; i < count; i++) {
            result.push({
                    headerName: getDiscountName(reason), width: 150,
                    valueGetter: ({row}) => ( getDiscountContent(row, reason, i)?.currencyAmount?.toString() ?? "" ),
                    type: "string", field: `charge_${reason.type.name}_${sha256(reason.message ?? "")}_${i}`,

                },
            )
        }
        return result

    });
}

export function PricingView(props: InvoiceViewerProps): ReactElement {
    const lines = createRows(props.invoice)
    const requiredChargeColumnsCounts = lines
        .map(it => getPricePerUnit(asItem(it)))
        .filter(notNull)
        .map(it => it.chargesArray)
        .map(it => sumByHash(it.map(it => it.reason)))
        .flatMap(it => it)
    const requiredChargeColumns =
        multiGroup(requiredChargeColumnsCounts, it => it[0])
            .mapValues(it => it.map(it => it[1]))
            .mapValues(it => max(it) ?? 0)

    const chargeColumns = createChargeColumns(requiredChargeColumns)

    const rows = fillGaps(lines)

    const columns: GridColDef<BillableLine>[] = [
        { headerName: '#', width: 100, valueGetter: ({row}) => row.line, type: "string", field: "line" },
        { headerName: 'Obj', width: 50, valueGetter: ({row}) => orderToString(asItem(row)?.orderReference), type: "string", field: "order", renderCell: ({row}) => <OrderMoji invoice={asItem(row)?.orderReference?.number} date={asItem(row)?.orderReference?.date} />},
        { headerName: 'SKU', width: 120, valueGetter: ({row}) => asItem(row)?.sku, type: "string", field: "sku" },
        { headerName: 'Sériová čísla', width: 120, valueGetter: ({row}) => asItem(row)?.serialNumbers, type: "string", field: "serialNumbers" },
        { headerName: 'Název', width: 350, valueGetter: ({row}) => asItem(row)?.name, type: "string", field: "name" },
        { headerName: 'Počet', width: 50, valueGetter: ({row}) => asItem(row)?.count, type: "number", field: "count" },
        { headerName: 'Fenix DPH', width: 100, valueGetter: ({row}) => asItem(row)?.fenixVATRate, type: "number", field: "vat", renderCell: ({value}) => `${value} %` },
        { headerName: 'Jednotková cena', width: 150, valueGetter: ({row}) => ( getPricePerUnit(asItem(row))?.grossPrice ), type: "string", field: "grossPrice" },
        ...chargeColumns,
        { headerName: 'Konečná cena', width: 150, valueGetter: ({row}) => ( getPricePerUnit(asItem(row))?.total ), type: "string", field: "unitPrice" },
    ];


    return <DataGrid rows={rows} columns={columns} getRowId={it => it.number}/>

}

const orderToString = (order: BuyerOrder | null | undefined) => order != null ? order.number + order.date : null

export function CustomsView(props: InvoiceViewerProps): JSX.Element {
    const data = unpack(props.invoice)
    const rows = summarize(data)
    const columns: GridColDef<ImportSummary>[]  = [
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

type ViewType = "pricing" | "customs" | "overview" | "invalid"

interface Numbered { number: number }

type NumberedBillable = Billable & Numbered

function createRows(invoice: Invoice): NumberedBillable[] {
    return unpack(invoice).map((it, index) => {
        // @ts-ignore
        it["number"] = index
        return it as NumberedBillable
    } )
}

export type InvalidLine = Numbered & {
    line: string
}

export type BillableLine = NumberedBillable | InvalidLine

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

export function unpack(it: Billable): Billable[] {
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

interface ImportSummary {
    weight: number,
    customsCode: string,
    countryOfOrigin: string,
    customsName: string | undefined
}

// Todo: use items
// TODO: Use multigroup
function summarize(it: Billable[]): ImportSummary[] {
    const grouped = doubleGroup(it,
            bill => itemize(bill)?.countryCode ?? "",
            value => itemize(value)?.customsCode ?? ""
    )

    return Object.entries(grouped).flatMap(([country, obj]) =>
        Object.entries(obj).map(([customsCode, items]) => {
            const sum = items
                .map(it => itemize(it))
                .map(it => (it?.count ?? 1) * (it?.gramsPerUnit ?? 0))
                .reduce((partialSum, a) => partialSum + a, 0)
            // @ts-ignore - this is here only because a bogus check on `any` done by IJ. Not really a problem on real build.
            return {countryOfOrigin: country, customsCode: customsCode, customsName: hsCodes[customsCode as keyof typeof hsCodes]?.nameCZ, weight: sum}
        })
    )


}

function asItem(it: BillableLine) {
    const billable = asBillable(it)
    return billable && itemize(billable)
}

export function itemize(it: Billable): Item | null {
    return it instanceof Item ? it : null
}