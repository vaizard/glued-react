import React, {Suspense, lazy} from 'react';
import AuthenticationContext from "../AuthenticationContext"
import CircularProgress from "@mui/material/CircularProgress";
import CenteredBox from "../tools/CenteredBox";
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';

const authEnforcePath = "https://gdev.industra.space/api/core/status/auth/v1"
//const authEnforcePath = "https://10.146.149.186/api/core/status/auth/v1"
//const authEnforcePath = "https://10.146.149.186/api/core/auth/enforce/v1"

// https://lokalise.com/blog/how-to-internationalize-react-application-using-i18next/
// https://lokalise.com/blog/react-i18n-intl/
 
class Core extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
	    content: null
        }
    }

    componentDidMount() {
    this.context.authenticatedFetch(authEnforcePath)
	    .then(response => response.json())
	    .then(content => { this.setState({content: content}) } )
        .catch((e) => {
            this.addAlert(e.toString(), "error", "An error occured")
        })
    }

    render(){
	if (this.state.content === null) { 
         return <CenteredBox>
             <CircularProgress />
          </CenteredBox>
        }
	
    const rows: GridRowsProp = [
      { id: 1, col1: 'Hello', col2: 'World' },
      { id: 2, col1: 'DataGridPro', col2: 'is Awesome' },
      { id: 3, col1: 'MUI', col2: 'is Amazing' },
    ];

    const columns: GridColDef[] = [
      { field: 'col1', headerName: 'Column 1', width: 150 },
      { field: 'col2', headerName: 'Column 2', width: 150 },
    ];

    return ( <>
        <div><pre>{JSON.stringify(this.state.content, null, 2)}</pre></div>
        <div style={{ height: 300, width: '100%' }}><DataGrid rows={rows} columns={columns} /></div>
     </> );

    }
}

class Prdel extends React.Component {
    render(){
        return <Core param="1234"/>
    }
}

// this.props.param

export default Core
export { Prdel as SOmethingElse }
Core.contextType = AuthenticationContext;