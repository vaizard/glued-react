import React from 'react';
import AuthenticationContext from "../AuthenticationContext"
import CircularProgress from "@mui/material/CircularProgress";
import CenteredBox from "../tools/CenteredBox";
import {DataGrid} from '@mui/x-data-grid';
import Button from "@mui/material/Button";
import {endpoint} from "../consts";

const authFailPath = endpoint + "/api/core/auth/test/fail/v1"
const authPassPath = endpoint + "/api/core/auth/test/pass/v1"

// https://lokalise.com/blog/how-to-internationalize-react-application-using-i18next/
// https://lokalise.com/blog/react-i18n-intl/

class Core extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
	        contentEnforce: null,
            contentFail: null,
            contentPass: null
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
        let c2 = this.state.contentFail.message.toString();
        let c3 = this.state.contentFail.request.toString();
    }

    const rows = [
      { id: 1, col1: authPassPath, col2: this.state.contentPass.message.toString(), col3: this.state.contentPass.request.toString() },
      { id: 2, col1: authFailPath, col2: c2, col3: c3 },
    ];

    const columns = [
      { field: 'col1', headerName: 'Endpoint', width: '50%' },
      { field: 'col2', headerName: 'Message', width: 150 },
      { field: 'col3', headerName: 'Request', width: 150 },
    ]


    return ( <>
        <h1>Authentication tests</h1>
        <div style={{ height: 300, width: '100%' }}><DataGrid rows={rows} columns={columns} /></div>
        <JSONViewer content={this.state.contentFail} label="Fail JSON" />
        <JSONViewer content={this.state.contentPass} label="Pass JSON" />
     </> );

    }
}

class CoreWelcome extends React.Component {
    render() {
        return ( <>
            <h1>Welcome</h1>
            <div>This is just a hello message.</div>
        </> );
    }
}

class JSONViewer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false
        }
    }
    render() {
        if(!this.state.open){
            return <Button onClick={() => {this.setState({open: true})}}>{this.props.label} ↷</Button>
        }
        return ( <>
            <div className="jsonBlock"><pre>{JSON.stringify(this.props.content, null, 2)}</pre></div>
            <Button onClick={() => {this.setState({open: false})}}>{this.props.label} ↶</Button>
        </>)
    }
}

// this.props.param

export default Core
export { CoreWelcome as CoreHello }

Core.contextType = AuthenticationContext;
