import React, {useEffect, useRef, useState} from 'react';
import CircularProgress from "@mui/material/CircularProgress";
import {DataGrid} from "@mui/x-data-grid";
import CenteredBox from "../../tools/CenteredBox";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import AuthenticationContext from "../../AuthenticationContext";
import SellIcon from '@mui/icons-material/Sell';
import LinkIcon from '@mui/icons-material/Link';
import {DateSelector, NumericInput} from "../annotator/Inputs";
import {LoadingButton} from "@mui/lab";
import Printer, {appendPath} from "../../printer"
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import "./style.css";

const foldProducts = products => {
    // mark out english variants
    products.forEach( it => {
        if(it?.permalink?.includes("/en/")) {
            it.lang = "en"
            it.name = "[EN] " + it.name
        } else {
            it.lang = "cz"
        }
    })
    return products
        .filter(it => it.id !== undefined)
        .filter(it => it.tax_class === "prvni-snizena-sazba-dph-15")
        //.filter(it => it.lang == 'en')
}



export default class Products extends React.Component {

    constructor(props) {
        super(props);
        this.endpoint = "https://gdev.industra.space/api/roasters/simple/products/v1";
        this.eanEndpoint = "https://localhost/"
        this.state = {
	        content: null,
            coffee: null,
        }
    }

    componentDidMount() {
        this.context.authenticatedFetch(this.endpoint)
	        .then(response => response.json())
            .then(response => response.data)
            .then(packlists => foldProducts(packlists))
	        .then(packlists => { this.setState({content: packlists}) } )
    }

    setPackList(e, packlist) {
        e.stopPropagation();
        this.setState({selected: packlist})
    }

    packlistByUuid(uuid) {
        if(uuid == null) {
            return null
        }
        return this.state.content.find(it => it.uuid === uuid) ?? null
    }

    closeDialog = (selectedItem) => {
        this.setState({selected: selectedItem})
    }

    setCoffee = (coffee) => {
        this.setState({coffee: coffee})
    };

    render() {
        const currentPacklist = this.packlistByUuid(this.state.selected)

        if ( this.state.content === null ) {
            return <CenteredBox>
                <CircularProgress />
            </CenteredBox>
        }

        const rows = this.state.content

        const columns = [
            { field: 'actions', headerName: '', width: 100, sortable: false, renderCell: (params) => (<CoffeeActions coffee={params.row} onGenerateTag={this.setCoffee} />) },
            { field: 'lang', headerName: 'Jazyk', width: '100', valueGetter: (params) => params.value.toUpperCase() },
            { field: 'name', headerName: 'Název', width: '500' },
            { field: 'categories', headerName: 'Kategorie', width: '250', valueGetter: (params) => params.row.categories.map(it => it.name).join(", ") },
        ];


        return ( <>
            { this.state.coffee && <PrinterDialog coffee={this.state.coffee} onClose={() => this.setCoffee(null)} /> }
            <div style={{ height: 800, width: '100%' }}>
                <DataGrid rows={rows} columns={columns} getRowId={it => it.id}/>
            </div>
        </> );
    }
}

Products.contextType = AuthenticationContext


function CoffeeActions(props) {
    return <>
        <IconButton onClick={() => props.onGenerateTag(props.coffee)}> <SellIcon /> </IconButton>
        <IconButton onClick={() => window.open(props.coffee.permalink, '_blank')}> <LinkIcon /> </IconButton>
    </>

}

async function getEan(coffee, selectedVariant, eanURL, generateNew) {
    if(selectedVariant === null || selectedVariant.weight <= 0) {
        return null
    }

    let url = new URL(eanURL)
    url.pathname = appendPath(url.pathname, [coffee.id]);
    url.searchParams.append("weight", selectedVariant.weight)
    url.searchParams.append("generate", generateNew)

    let result = await fetch(url)

    if(!result.ok) {
        console.log(result)
        return null
    }

    return (await result.json()).ean ?? null
}

const now = new Date();
let defaultExpiry = new Date();
defaultExpiry.setMonth(defaultExpiry.getMonth() + 6);


function PrinterDialog(props) {
    const {coffee} = props;
    const printUrl = "https://page-printer.internal.kompresorovna.anilez.cz/print";
    const pdfUrl = "https://api.tomaszelina.cz/pdf/"
    const eanURI = "https://store.internal.kompresorovna.anilez.cz/ean/"


    const [weight, setWeight] = useState(0)

    const selectedVariant = {
        weight: weight
    }

    const [ean, setEan] = useState(null)
    const [roastDate, setRoastDate] = useState(convertDate(now))
    const [expiryDate, setExpiryDate] = useState(convertDate(defaultExpiry))
    const [printCount, setPrintCount] = useState(1)
    const [generatingEan, setGeneratingEan] = useState(false)
    const [loadingEan, setLoadingEan] = useState(false)
    const [printing, setPrinting] = useState(false)
    const [printQueue, setPrintQueue] = useState([])
    const printer = useRef(new Printer(pdfUrl, printUrl, setPrintQueue))

    useEffect(() => {
        console.log("running!")
        if(generatingEan) {
            return
        }
        let overriden = false
        setLoadingEan(true)
        getEan(coffee, selectedVariant, eanURI, false).then(result => {
            if(!overriden) {
                setEan(result)
                setLoadingEan(false)
            }
        })
        return () => {overriden = true} // this is a function that gets executed when the effect is relaunched.
    }, [JSON.stringify(selectedVariant), generatingEan])


    const loading = generatingEan && loadingEan

    async function handleGenerateEan() {
        setGeneratingEan(true)
        try {
            await getEan(coffee, selectedVariant, eanURI, true)
        } finally {
            setGeneratingEan(false)
        }
    }

    async function handlePrint() {
        setPrinting(true)
        try {
            await printer.current.print("coffeeean", {
                withbyro: false, name: coffee.name, gtin: ean,
                link: coffee.permalink, weight: weight, produced: roastDate,
                expiration: expiryDate, copies: printCount
            }
            )
        } finally {
            setPrinting(false)
        }
    }

    const printable = printCount > 0 && expiryDate && roastDate && weight > 0 && ean != null

    return <Dialog
        onClose={props.onClose}
        open={coffee !== null}
        maxWidth={"sm"}
        fullWidth={true}
    >
        <DialogTitle>Tisk štítku</DialogTitle>
        <DialogContent>
            <NumericInput label="Váha (g)" unit="g" required={true} value={weight} onValueChange={it => setWeight(it)}/>
            <DateSelector label="Upraženo" value={roastDate} onValueChange={ it => setRoastDate(it) } required={true}/>
            <DateSelector label="Expirace" value={expiryDate} onValueChange={ it => setExpiryDate(it) } required={true}/>
            <NumericInput label="Počet štítků" unit="ks" required={true} value={printCount} onValueChange={it => setPrintCount(it)}/>

            <div>{ ean === null ? "EAN pro tuto váhu není vygenerován" : "EAN: " + ean}</div>
            <div className="button-group">
                <LoadingButton loading={generatingEan} disabled={loading || ean !== null || selectedVariant.weight <= 0 } onClick={handleGenerateEan} variant="contained">Vygenerovat EAN</LoadingButton>
                <LoadingButton loading={printing} disabled={loading || !printable} onClick={handlePrint} variant="contained">Tisknout</LoadingButton>
            </div>

        </DialogContent>


    </Dialog>

}


function convertDate(date) {
    return date.toISOString().slice(0,10)
}
