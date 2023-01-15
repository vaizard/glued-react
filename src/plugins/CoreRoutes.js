import React from 'react';
import AuthenticationContext from "../AuthenticationContext"
import CircularProgress from "@mui/material/CircularProgress";
import CenteredBox from "../tools/CenteredBox";
import {endpoint} from "../consts";
import {DataGrid} from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import {JSONViewer} from "./Core";


const RoutesPath = endpoint + "/api/core/routes/v1"

class CoreRoutes extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
	    content: null
        }
    }

    componentDidMount() {

        this.context.authenticatedFetch(RoutesPath)
            .then(response => response.json())
            .then(content => { this.setState({content: content}) } )
            .catch((e) => {
                this.addAlert(e.toString(), "error", "An error occurred.")
            })
 }


    render() {
        if ( this.state.content === null ) {
            return <CenteredBox>
                <CircularProgress />
            </CenteredBox>
        }

        // TODO so, how TF do I iterate over {content} to generate a set of rows? plz for(t)each me
        const rows = [
            { id: 1, col1: "i.service", col2: "<a href='i.url'>i.label</a>", col3: "i.dscr" },
        ];

        const columns = [
            { field: 'col1', headerName: 'Service', width: '20%' },
            { field: 'col2', headerName: 'Label', width: '30%' },
            { field: 'col3', headerName: 'Description', width: '50%' },
        ]


        return ( <>
            <h1>Routes</h1>
            <div style={{ height: 300, width: '100%' }}><DataGrid rows={rows} columns={columns} /></div>
            <JSONViewer content={this.state.content} label="JSON" />
        </> );

    }
}


export default CoreRoutes
CoreRoutes.contextType = AuthenticationContext;
