import React from "react";
import CounterpartySelector from "./CounterpartySelector";
import {CurrencySelector, DateSelector, InputSize, NumericInput, Text} from "./Inputs";
import Button from "@mui/material/Button";
import "./style.css"
import AuthenticationContext from "../../AuthenticationContext";

import {JSONViewer} from "../../components/JSONViewer";

/**
 * Enum of saving state
 */
export const SaveState = {
    Unsaved: "unsaved",
    Saving: "saving",
    Saved: "saved",
    Errored: "errored"
};

export default class AnnotationUI extends React.Component {
    defaultState = {
        data: {
            currency: "CZK"
        },
        confirmed: false,
    }

    constructor(props) {
        super(props);
        this.state = structuredClone(this.defaultState)
        this.state.uuid = crypto.randomUUID();
    }

    reset() {
        this.setState({...structuredClone(this.defaultState), uuid: crypto.randomUUID()});
    }

    setField(fieldName, value) {
        let newValue = this.state.data ?? {};
        newValue[fieldName] = value;
        this.setState({data: newValue})
    }


    allFilled = () =>
        (this.state.data?.currency !== null && this.state.data?.currency !== undefined) &&
        (this.state.data?.withVAT !== null && this.state.data?.withVAT !== undefined) &&
        (this.state.data?.withoutVAT !== null && this.state.data?.withoutVAT !== undefined) &&
        (this.state.data?.duzp !== null && this.state.data?.duzp !== undefined) &&
        (this.state.data?.counterparty !== null && this.state.data?.counterparty !== undefined);


    render() {
        const data = this.state?.data;
        return <div style={mainStyle} key={this.state.uuid}>
            <div style={containerStyle}>
                <PDFView path={this.props.task.pdf}/>
            </div>
            <div style={containerStyle}>
                <CounterpartySelector initialInput={this.props.initialInput} counterparty={this.state.data?.counterparty} setCounterparty={(it) => this.setField("counterparty", it)} endpoints={this.props.endpoints} />
                <Text label="Popis" required={false} value={data?.description ?? null} onValueChange={(it) => this.setField("description", it)}/>
                <Text label="Číslo z účtárny" required={false} value={data?.deef ?? null} onValueChange={(it) => this.setField("deef", it)}/>
                <Text label="Variabilní smybol / číslo účtenky" required={false} value={data?.vs ?? null} onValueChange={(it) => this.setField("vs", it)}/>
                <DateSelector label="DUZP" value={data?.duzp ?? null} onValueChange={(it) => this.setField("duzp", it)} required={true}/>
                <NumericInput label="Částka s DPH" size={InputSize.Half} unit={data?.currency ?? null} required={true} value={data?.withVAT ?? null} onValueChange={it => this.setField("withVAT", it)}/>
                <NumericInput label="Částka bez DPH" size={InputSize.Half} unit={data?.currency ?? null} required={true} value={data?.withoutVAT ?? null} onValueChange={it => this.setField("withoutVAT", it)}/>
                <CurrencySelector value={data?.currency ?? null} size={InputSize.Full} onChange={it => this.setField("currency", it)}/>
                <div className="between">
                    <Button disabled={ this.props.onReject === undefined } color="error" onClick={() => this.props.onReject?.(data)} variant="text" tabIndex={-1}>Nelze anotovat</Button>
                    <div >{this.props.initialInput}</div>
                    <Button disabled={!this.allFilled()} onClick={() => this.props.onSave?.(data)} variant="contained">Uložit</Button>
                </div>
                <JSONViewer label={"JSON"} content={this.state.data}/>
            </div>
        </div>
    }

}

AnnotationUI.contextType = AuthenticationContext;


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