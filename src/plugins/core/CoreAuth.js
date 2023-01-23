import React from 'react';
import AuthenticationContext from "../../AuthenticationContext"
import CircularProgress from "@mui/material/CircularProgress";
import CenteredBox from "../../tools/CenteredBox";
import {endpoint} from "../../consts";
import {JSONViewer} from "./Core";
import {DataGrid} from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import Link from '@mui/material/Link';

const authFailPath  = endpoint + "/api/core/auth/test/fail/v1"
const authPassPath  = endpoint + "/api/core/auth/test/pass/v1"
const authJWTFetch  = endpoint + "/api/core/status/jwt/fetch/v1"
const authJWTDecode = endpoint + "/api/core/status/jwt/decode/v1"

class CoreAuth extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            contentFail: null,
            contentPass: null,
            contentJWTFetch: null,
            contentJWTDecode: null,
        }
    }

    componentDidMount() {

        this.context.authenticatedFetch(authPassPath)
            .then(response => response.json())
            .then(content => { this.setState({contentPass: content}) } )
            .catch((e) => {
                this.addAlert(e.toString(), "error", "An error occurred.")
            })

        this.context.authenticatedFetch(authFailPath)
            .then(response => response.json())
            .then(content => { this.setState({contentFail: content}) } )
            .catch((e) => {
                this.addAlert(e.toString(), "error", "An error occurred.")
            })

        this.context.authenticatedFetch(authJWTFetch)
            .then(response => response.json())
            .then(content => { this.setState({contentJWTFetch: content}) } )
            .catch((e) => {
                this.addAlert(e.toString(), "error", "An error occurred.")
            })

        this.context.authenticatedFetch(authJWTDecode)
            .then(response => response.json())
            .then(content => { this.setState({contentJWTDecode: content}) } )
            .catch((e) => {
                this.addAlert(e.toString(), "error", "An error occurred.")
            })

    }

    render() {
        if ( this.state.contentPass === null ) {
            return <CenteredBox>
                <CircularProgress />
            </CenteredBox>
        }

        // TODO c2, c3 are held back at null even if backend is wrong and sends a reply
        let c2 = 'null';
        let c3 = 'null';

        if ( this.state.contentFail !== null ) {
            c2 = this.state.contentFail.message.toString();
            c3 = this.state.contentFail.request.toString();
        }


        const rows = [
            { id: 1, col1: authPassPath, col2: this.state.contentPass.message.toString(), col3: this.state.contentPass.request.toString(), col4: authPassPath },
            { id: 2, col1: authFailPath, col2: c2, col3: c3, col4: authFailPath },
        ];

        const columns = [
            { field: 'col1', headerName: 'Endpoint', width: 150, renderCell: (params) => <Link href={params.value}>Endpoint</Link> },
            { field: 'col2', headerName: 'Message', width: 150 },
            { field: 'col3', headerName: 'Request', width: 150 },
            { field: 'col4', headerName: 'Link I want to have in endpoint', width: 450 }
        ]


        return ( <>
            <h1>Authentication status</h1>
            <div style={{ height: 300, width: '100%' }}><DataGrid rows={rows} columns={columns} /></div>
            <JSONViewer content={this.state.contentFail} label="Fail JSON" />
            <JSONViewer content={this.state.contentPass} label="Pass JSON" />
            <JSONViewer content={this.state.contentJWTFetch} label="JWT BLOB" />
            <JSONViewer content={this.state.contentJWTDecode} label="JWT JSON" />
        </> );

    }
}


export default CoreAuth
CoreAuth.contextType = AuthenticationContext;
