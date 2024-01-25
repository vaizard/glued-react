import TextField from "@mui/material/TextField/TextField";
import React, {Component} from "react";
import Autocomplete from "@mui/material/Autocomplete/Autocomplete";
import "./style.css"
import InputAdornment from "@mui/material/InputAdornment";
import {InputSize, Text} from "./SpecificTextInputs"


function DateSelector({value, onValueChange, label, size, required}){
    return <TextField className={getInputClassName(size)} InputLabelProps={{ shrink: true }} type="date" value={value} onChange={e => onValueChange(eventToValue(e))} required={required} label={label}/>
}


export function eventToValue(event) {
    const result = event.target.value;
    if(result === "") {
        return null;
    }
    return result
}

function parseNumber(text) {
    if(!isValidNumber(text)) {return null}
    const result = Number.parseFloat(text);
    if(Number.isNaN(result)) {return null}
    return result;
}


/**
 * Uncontrolled numeric input. The value property is a default value.
 */

class NumericInput extends Component {
    constructor(props) {
        super(props)
        this.state = {
            textInput: ""
        }
    }

    handleTextChange = text => {
        const num = parseNumber(text);
        this.props.onValueChange?.(num);
        this.setState({textInput: text});
    }

    render() {
        let props = {
            inputProps: { inputMode: 'numeric', pattern: '[0-9]*' },
        }
        if(this.props.unit !== undefined && this.props.unit !== null) {
            props.inputProps.endAdornment = <InputAdornment position="end">{ this.props.unit }</InputAdornment>
        }
        return <Text {...this.props} value={this.state.textInput} error={!this.isValidNumber()} onValueChange={this.handleTextChange} other={props}/>
    }

    isValidNumber() {
        return this.state.textInput === "" || isValidNumber(this.state.textInput);
    }
}

const numericRegex = /^\d+(\.\d+)?$/;
function isValidNumber(text) {
    return numericRegex.test(text)
}



const supportedCurrencies = ["CZK", "EUR"];

function CurrencySelector ({value, onChange, required, size}) {
    return <Autocomplete
        disablePortal
        defaultValue="CZK"
        autoHighlight={true}
        required={required}
        value={value}
        onChange={(e, it) => onChange(it)}
        options={supportedCurrencies}
        className={getInputClassName(size)}
        renderInput={(params) => <TextField {...params} label="Měna" />}
    />
}

export const getInputClassName = (inputSize) => `forminput ${inputSize ?? InputSize.Full}`;

export {DateSelector, Text, CurrencySelector, NumericInput, InputSize}