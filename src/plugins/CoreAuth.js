import React from 'react';
import CircularProgress from "@mui/material/CircularProgress";
import CenteredBox from "../tools/CenteredBox";
import {endpoint} from "../consts";

const healthPath = endpoint +  "/api/skeleton/health/v1";

class CoreAuth extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
	    content: null
        }
    }

    componentDidMount() {
        fetch(healthPath)
	    .then(response => response.json())
	    .then(content => { this.setState({content: content}) } )
    }

    render(){
	if (this.state.content === null) { 
         return <CenteredBox>
             <CircularProgress />
          </CenteredBox>
        }
	
	
	return <div>{JSON.stringify(this.state.content)}</div>
    }
}


export default CoreAuth