import React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import {debounce} from "@mui/material";


/*class Annotator extends React.Component {
    render() {
        return <div style={}>
            <PDFView path={"./it.pdf"}/>
            <div>
                <Autocomplete name="Counterparty" />
                <Autocomplete name="ICO" />
                <Text name="Předmět"/>
                <Autocomplete name="DUZP" />
                {//Rozpis s DPH
                }
                <Autocomplete name="Celkem s DPH" />
                <Buttons function="DPHs"/>
                <Autocomplete name="Celkem bez DPH" />
                <SubmitButton />
            </div>
        </div>
    }
}*/

const searchResultPath = "http://localhost:5000/search?query="



class CounterpartySelector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            loading: true,
            options: []
        }
        this.searchAbortController = null
    }

    setOpen = x => this.setState({open: x});

    cancelPreviousSearch= () => {
        if(this.searchAbortController !== null) {
            this.searchAbortController.abort()
        }
        this.searchAbortController = new AbortController()
    }

    startSearch = async (inputText) => {
        this.cancelPreviousSearch()
        try {
            let response = await fetch(searchResultPath + inputText)
            let json = await response.json()
            this.handleSearchResults(json)
        } catch (e) {
            if (e.name !== 'AbortError') {
                throw e
            }
        }
    }

    render() {
        return (
            <>
                <div>Node environment is: {process.env.REACT_APP_TEST}</div>
                <Autocomplete
                    id="Counterparty"
                    open={this.state.open}
                    onOpen={() => {
                        this.setOpen(true);
                    }}
                    onClose={() => {
                        this.setOpen(false);
                    }}
                    // isOptionEqualToValue={(option, value) => option.title === value.title}
                    getOptionLabel={(option) => option.subject}
                    filterOptions={x => x}
                    filterSelectedOptions={false}
                    onInputChange={debounce((event, input) => this.startSearch(input), 250)}
                    options={this.state.options}
                    loading={this.state.loading}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Asynchronous"
                            InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                    <React.Fragment>
                                        {this.state.loading ? <CircularProgress color="inherit" size={20} /> : null}
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
        this.setState({options: result})
    }
}

/*function localSearch(options, inputValue, number = 10) {
    let results = [];
    for (const option of options) {
        if(matchesByAnything(option, inputValue)) {
            results.push(option);
            if(results.length >= number) { break }
        }
    }
    return results;


}*/

class PDFView extends React.Component {
    render() {
        return <iframe src={this.props.path}/>
    }
}

export default CounterpartySelector