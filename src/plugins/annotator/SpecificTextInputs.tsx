import TextField from "@mui/material/TextField/TextField";
import React from "react";
import {eventToValue, getInputClassName} from "./Inputs";

export enum InputSize {
    Full= 'big',
    Half = 'small',
    Third = 'third',
}

interface TextProps {
    value: string,
    onValueChange: (x: string) => void,
    required?: boolean,
    size?: InputSize,
    other?: any
    error?: string
    label: string
}

export function Text ({value, onValueChange, required, size, label, other, error}: TextProps) {
    return <TextField
        className={getInputClassName(size)}
        value={value ?? ""}
        onChange={e => onValueChange(eventToValue(e))}
        required={required}
        label={label}
        {...other}
        error={error}

    />
}