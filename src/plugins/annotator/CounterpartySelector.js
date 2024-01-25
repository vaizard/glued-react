import React from "react";
import Autocomplete from "@mui/material/Autocomplete/Autocomplete";
import {debounce, Snackbar} from "@mui/material";
import TextField from "@mui/material/TextField/TextField";
import CircularProgress from "@mui/material/CircularProgress/CircularProgress";
import Box from "@mui/material/Box";
import "./style.css"
import {InputSize, Text} from "./Inputs";
import {searchResultToSomethingFuckingNormal} from "./fuckingAdapterOfFuckingPavelShit";
import Alert from "@mui/material/Alert";

class CounterpartySelector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            options: [],
            snack: null,
            closeInterval: null,
        }
        this.searchAbortController = null
        this.searchResultPath = props.endpoints.get('contacts').url
    }

    cancelPreviousSearch = () => {
        if(this.searchAbortController !== null) {
            this.searchAbortController.abort()
        }
        this.searchAbortController = new AbortController()
    }

    startSearch = async (inputText) => {
        try {
            if(inputText.length === 0) {
                inputText = this.props.initialInput ?? ""
            }
            this.cancelPreviousSearch()
            this.setState({loading: true})

            const result = await this.getResults(inputText ?? "")
            this.handleSearchResults(result)

        } catch (e) {
            if (e.name !== 'AbortError') {
                this.openSnack("API search resulted in an error", e)
                this.handleSearchResults([])
            }
        }
    }

    componentDidMount() {
        this.startSearch("")
        //alert(this.props.initialInput)
    }

    getResults = async (inputText) => {
        if(inputText.length === 0) {
            return []
        }

        const url = new URL(this.searchResultPath)
        url.searchParams.set("q", inputText)

        const response = await fetch(url.toString());
        if(response.ok) {
            let json = await response.json();
            if(json === null) {
                this.openSnack("API broke again (returned 200, but null)")
            }
            return json ?? []
        } else {
            this.openSnack(`API broke again (returned ${response.status})`)
            return []
        }

    }

    getLabel = (contact) => {
        let identifier
        if(contact.ico !== undefined){
            identifier = `IČO ${contact.ico}`
        }else if(contact.dic !== undefined){
            identifier = `DIČ ${contact.dic}`
        } else {
            identifier = `Bez identifikace`
        }
        return `${contact.name} (${identifier})`
    }

    handleSnackClose = () => this.setState({closeInterval: null})
    openSnack = (snack, error) => {
        console.log(error ?? snack)
        if(this.state.closeInterval) {
            clearTimeout(this.state.closeInterval)
        }
        const interval = setTimeout(this.handleSnackClose, 5000)
        this.setState({ snack: snack, closeInterval: interval })
    }

    render() {
        return (
            <>
                { /*TODO: delete me once Pavel fixes all the shit*/ }
                <Snackbar
                    open={this.state.closeInterval !== null}
                    onClose={this.handleSnackClose}
                >
                    <Alert
                        onClose={this.handleSnackClose}
                        severity="error"
                        variant="filled"
                        sx={{ width: '100%' }}
                    >
                        {this.state.snack ?? ""}
                    </Alert>
                </Snackbar>
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
                    autoFocus={true}
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
export default function CounterPartyForm({counterparty, setCounterparty, endpoints, initialInput}) {

    function setField(fieldName, value) {
        let newCouterparty = counterparty ?? {};
        newCouterparty[fieldName] = value;
        setCounterparty(newCouterparty)
    }

    return <Box component="form">
        <CounterpartySelector initialInput={initialInput} onSelected={setCounterparty} endpoints={endpoints}/>
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
