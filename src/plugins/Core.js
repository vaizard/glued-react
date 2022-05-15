import React, {Suspense, lazy} from 'react';
import AuthenticationContext from "../AuthenticationContext"
import CircularProgress from "@mui/material/CircularProgress";
import CenteredBox from "../tools/CenteredBox";

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
	return <div><pre>{JSON.stringify(this.state.content, null, 2)}</pre></div>
    }
}

export default Core
Core.contextType = AuthenticationContext;