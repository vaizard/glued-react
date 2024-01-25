import React from 'react';
import AuthenticationContext from "../../AuthenticationContext"
import CircularProgress from "@mui/material/CircularProgress";
import CenteredBox from "../../tools/CenteredBox";
import {endpoint} from "../../consts";
import {DataGrid} from "@mui/x-data-grid";
import {JSONViewer} from "../../components/JSONViewer";


const RoutesPath = endpoint + "/api/core/routes/v1"

class Routes extends React.Component {


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

        const rows = this.state.content;

        const columns = [
            { field: 'name', headerName: 'Name', width: '200'},
            { field: 'label', headerName: 'Label', width: '300'},
            { field: 'url', headerName: 'URL', width: '500'},
            { field: 'dscr', headerName: 'Description', width: '500' },
        ];


        return ( <>
            <h1>Routes</h1>
            <div style={{ height: 800, width: '100%' }}><DataGrid rows={rows} columns={columns} getRowId={it => it.name}/></div>
            <JSONViewer content={this.state.content} label="JSON" />
        </> );

    }
}


export default Routes
Routes.contextType = AuthenticationContext;
