import React, {Suspense, lazy} from 'react';
import AuthenticationContext from "../AuthenticationContext"
import CircularProgress from "@mui/material/CircularProgress";
import CenteredBox from "../tools/CenteredBox";

const healthPath = "https://10.146.149.186/api/skeleton/health/v1"

class Skeleton extends React.Component {


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


export default Skeleton