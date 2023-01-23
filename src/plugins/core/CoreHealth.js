import React from 'react';
import AuthenticationContext from "../../AuthenticationContext"
import CircularProgress from "@mui/material/CircularProgress";
import CenteredBox from "../../tools/CenteredBox";
import {endpoint} from "../../consts";

const healthPath = endpoint +  "/api/core/health/v1";

class CoreHealth extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
	    content: null
        }
    }

    componentDidMount() {
        this.context.authenticatedFetch(healthPath)
            .then(response => response.json())
            .then(content => { this.setState({content: content}) } )
            .catch((e) => {
                this.addAlert(e.toString(), "error", "An error occurred.")
            })
    }

    render(){
    if (this.state.content === null) {
        return <CenteredBox>
            <CircularProgress />
        </CenteredBox>
    }

    return <div className="jsonSkeletonHealth"><pre>{JSON.stringify(this.state.content, null, 2)}</pre></div>

    }
}

export default CoreHealth;
CoreHealth.contextType = AuthenticationContext;