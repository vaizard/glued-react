import React, {useState} from "react";
import Autocomplete from "@mui/material/Autocomplete/Autocomplete";
import {debounce} from "@mui/material";
import TextField from "@mui/material/TextField/TextField";
import CircularProgress from "@mui/material/CircularProgress/CircularProgress";
import Box from "@mui/material/Box";
import "./style.css"
import {InputSize, Text} from "./Inputs";
import {searchResultToSomethingFuckingNormal} from "./fuckingAdapterOfFuckingPavelShit";

const searchResultPath = "http://localhost:8000/search?query="


class CounterpartySelector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            options: []
        }
        this.searchAbortController = null
        this.searchResultPath = props.endpoints.get('be_contacts_v1').url
        console.log(props)
    }

    cancelPreviousSearch = () => {
        if(this.searchAbortController !== null) {
            this.searchAbortController.abort()
        }
        this.searchAbortController = new AbortController()
    }

    startSearch = async (inputText) => {
        try {
            this.cancelPreviousSearch()
            this.setState({loading: true})
            let response = await fetch(this.searchResultPath + "?q=" + encodeURIComponent(inputText));
            if(response.ok) {
                let json = await response.json();
                this.handleSearchResults(json)
            } else {
                this.handleSearchResults([])
            }

        } catch (e) {
            if (e.name !== 'AbortError') {
                console.error(e)
                this.setState({loading: false})
            }
        }
    }

    getLabel = (contact) => {
        let identifier = null
        if(contact.ico !== undefined){
            identifier = `IČO ${contact.ico}`
        }else if(contact.dic !== undefined){
            identifier = `DIČ ${contact.dic}`
        } else {
            identifier = `Bez identifikace`
        }
        return `${contact.name} (${identifier})`
    }

    render() {
        return (
            <>
                <Autocomplete
                    className="forminput"
                    id="counterparty"
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    getOptionLabel={this.getLabel}
                    filterOptions={x => x}
                    filterSelectedOptions={false}
                    onInputChange={debounce((event, input) => this.startSearch(input), 250)}
                    options={this.state.options}
                    loading={this.state.loading}
                    onChange={(e, it) => this.props.onSelected(it)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Firma (IČO)"
                            InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                    <React.Fragment>
                                        {this.state.loading ? <CircularProgress color="inherit" size={20} /> : null}
                                        {/*{ <IconButton><AddIcon/></IconButton> }*/}
                                        {params.InputProps.endAdornment}
                                    </React.Fragment>
                                ),
                            }}
                        />
                    )}
                />
            </>
        );
    }

    handleSearchResults(result) {
        console.log(result);
        console.log(searchResultToSomethingFuckingNormal(result))
        this.setState({options: searchResultToSomethingFuckingNormal(result), loading: false})
    }
}


/**
 * Controlled Counterparty form.
 * @param props
 */
export default function CounterPartyForm({counterparty, setCounterparty, endpoints}) {

    function setField(fieldName, value) {
        let newCouterparty = counterparty ?? {};
        newCouterparty[fieldName] = value;
        setCounterparty(newCouterparty)
    }


    return <Box component="form">
        <CounterpartySelector onSelected={setCounterparty} endpoints={endpoints}/>
        {counterparty?.id != null ? null : <>
            <Text size={InputSize.Half} value={counterparty?.ico}
                       onValueChange={it => setField("ico", it)} required={true} label="IČO"/>
            <Text size={InputSize.Half} value={counterparty?.dic}
                       onValueChange={it => setField("dic", it)} required={false} label="DIČ"/>
            <Text size={InputSize.Full} value={counterparty?.name}
                       onValueChange={it => setField("name", it)} required={true} label="Název firmy"/>
            </>
        }
    </Box>
}
