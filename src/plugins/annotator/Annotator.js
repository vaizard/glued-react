import React, {Component} from "react";
import CounterpartySelector from "./CounterpartySelector";
import {CurrencySelector, DateSelector, InputSize, NumericInput, Text} from "./Inputs";
import {JSONViewer} from "../core/Core";
import Button from "@mui/material/Button";
import "./style.css"
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import CenteredLoader from "../../tools/CenteredLoader";
import DialogContentText from "@mui/material/DialogContentText";
import AuthenticationContext from "../../AuthenticationContext";
import printJS from "print-js";
import {LoadingButton} from "@mui/lab";
import Printer from "../../printer"

/**
 * Enum of saving state
 */
const SaveState = {
    Unsaved: "unsaved",
    Saving: "saving",
    Saved: "saved",
    Errored: "errored"
};

class Annotator extends React.Component {


    defaultState = {
        data: {
            currency: "CZK"
        },
        confirmed: false,
        saveState: SaveState.Unsaved,
    }

    constructor(props) {
        super(props);
        this.state = structuredClone(this.defaultState)
        this.state.uuid = crypto.randomUUID();
        this.saveEndpoint = props.endpoints.get("be_stor_annotations_v1").url;
        this.printer = new Printer("https://api.tomaszelina.cz/pdf")
    }

    reset() {
        this.setState({...structuredClone(this.defaultState), uuid: crypto.randomUUID()});
    }

    setField(fieldName, value) {
        let newValue = this.state.data ?? {};
        newValue[fieldName] = value;
        this.setState({data: newValue})
    }

    handleSaveDialogClose = () => {
        this.reset()
    }

    saveAnnotation = async () => {
        this.setState({saveState: SaveState.Saving})
        let result = null;
        try {
            result = await this.context.authenticatedFetch(this.saveEndpoint, {
                method: 'POST',
                headers: {'Content-Type': 'application/json' },
                body: JSON.stringify(this.state.data),
            })
        } catch (e) {
            this.setState({saveState: SaveState.Errored})
            console.log(e)
        }
        if(result?.ok) {
            this.setState({saveState: SaveState.Saved, printUrl: this.printer.getUrl("generictext", {text: "Test"})})
        } else {
            this.setState({saveState: SaveState.Errored})
            console.log(result)
        }
    }

    allFilled = () =>
        (this.state.data?.currency !== null && this.state.data?.currency !== undefined) &&
        (this.state.data?.withVAT !== null && this.state.data?.withVAT !== undefined) &&
        (this.state.data?.withoutVAT !== null && this.state.data?.withoutVAT !== undefined) &&
        (this.state.data?.duzp !== null && this.state.data?.duzp !== undefined) &&
        (this.state.data?.description !== null && this.state.data?.description !== undefined) &&
        (this.state.data?.counterparty !== null && this.state.data?.counterparty !== undefined);


    render() {
        const data = this.state?.data;
        return <div style={mainStyle} key={this.state.uuid}>
            <div style={containerStyle}>
                <PDFView path={"/industrial.pdf"}/>
            </div>
            <div style={containerStyle}>
                <CounterpartySelector counterparty={this.state.data?.counterparty} setCounterparty={(it) => this.setField("counterparty", it)} endpoints={this.props.endpoints} />
                <Text label="Popis" required={true} value={this.state?.data?.description ?? null} onValueChange={(it) => this.setField("description", it)}/>
                <DateSelector label="DUZP" value={this.state?.data?.duzp ?? null} onValueChange={(it) => this.setField("duzp", it)} required={true}/>
                <NumericInput label="Částka s DPH" size={InputSize.Half} unit={data?.currency ?? null} required={true} value={this.state?.data?.withVAT ?? null} onValueChange={it => this.setField("withVAT", it)}/>
                <NumericInput label="Částka bez DPH" size={InputSize.Half} unit={data?.currency ?? null} required={true} value={this.state?.data?.withoutVat ?? null} onValueChange={it => this.setField("withoutVAT", it)}/>
                <CurrencySelector value={data?.currency ?? null} size={InputSize.Full} onChange={it => this.setField("currency", it)}/>
                <div class="right-aligned"><Button disabled={!this.allFilled()} onClick={this.saveAnnotation} variant="contained">Uložit</Button></div>


                <JSONViewer content={data} label="JSON Preview"/>

                <SaveDialog state={this.state.saveState} printUrl={this.state.printUrl} open={this.state.saveState !== SaveState.Unsaved} onClose={this.handleSaveDialogClose}/>

            </div>
        </div>
    }

}

Annotator.contextType = AuthenticationContext;



// SaveState, link, and that's it ;)
class SaveDialog extends Component{
    constructor(props) {
        super(props)
        this.state = {loading: false}
    }

    setLoading = (state) => {this.setState({loading: state})};

    handlePrintArchiveLabel = () => {
        printJS({
            printable: this.props.printUrl,
            onLoadingStart: () => this.setLoading(true),
            onLoadingEnd: () => this.setLoading(false)
        })
    }
    render() {
        const status = this.props.state === SaveState.Saving ? "Ukládání..." : this.props.state === SaveState.Saved ? "Uloženo" : "Nastala chyba :("
        return <Dialog
            onClose={this.props.onClose}
            open={this.props.open}
            maxWidth={"sm"}
            fullWidth={true}
        >
            <DialogTitle>{status}</DialogTitle>
            <DialogContent>
                {this.props.state === SaveState.Saving && <CenteredLoader vertical={false}/>}
                {this.props.state === SaveState.Saved && <DialogContentText>Anotace byla uložena. Nyní můžete buďto vytisknout košilku (pokud je to potřeba), nebo pokračovat k další anotaci</DialogContentText>}
                {this.props.state === SaveState.Errored && <DialogContentText>Při ukládání nastala chyba. Více informací je v konzoli.</DialogContentText>}
            </DialogContent>
            {(this.props.state === SaveState.Saved || this.props.state === SaveState.Errored) && <DialogActions>
                {this.props.state === SaveState.Saved && this.props.printUrl && <LoadingButton loading={this.state.loading} onClick={this.handlePrintArchiveLabel} variant="outlined">Vytisknout košilku</LoadingButton>}
                {this.props.state === SaveState.Saved && <Button onClick={this.props.onClose} variant="contained">Další anotace</Button>}
                {this.props.state === SaveState.Errored && <Button color="error" onClick={this.props.onClose} variant="contained">Zavřít</Button>}
            </DialogActions>}
        </Dialog>
    }
}




// DPH handling: vyplň ten, který není vyplněný. Označ, který je závislý. DPH select.

const mainStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px"
}

const containerStyle = {
    minWidth: "400px",
    flex: "1",
    minHeight: "800px"
}

const iframeStyle = {
    width: '100%',
    height: '100%',
}



class PDFView extends React.Component {
    render() {
        return <iframe style={iframeStyle} src={this.props.path}/>
    }
}

export default Annotator