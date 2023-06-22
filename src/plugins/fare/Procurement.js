import React from 'react';
import CircularProgress from "@mui/material/CircularProgress";
import {DataGrid} from "@mui/x-data-grid";
import CenteredBox from "../../tools/CenteredBox";

export default class Procurement extends React.Component {


    constructor(props) {
        super(props);
        this.endpoint = props.endpoints.get("be_fare_procurement_v3").url
        this.state = {
	        content: null
        }
    }

    componentDidMount() {
        fetch(this.endpoint)
	        .then(response => response.json())
	        .then(content => { this.setState({content: content.data}) } )
    }

    render() {
        if ( this.state.content === null ) {
            return <CenteredBox>
                <CircularProgress />
            </CenteredBox>
        }

        const rows = this.state.content;

        const columns = [
            { field: 'idx', headerName: 'ID', width: '200'},
            { field: 'mfr', headerName: 'Výrobce', width: '300'},
            { field: 'name', headerName: 'Název', width: '500'},
            { field: 'ref', headerName: 'Reference', width: '500'},
            { field: 'sku', headerName: 'SKU', width: '500'},
            { field: 'qty', headerName: 'Počet', width: '500' },
        ];


        return ( <>
            <div style={{ height: 800, width: '100%' }}>
                <DataGrid rows={rows} columns={columns} getRowId={it => it.name}/>
            </div>
        </> );
    }
}