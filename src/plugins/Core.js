import React from 'react';
import AuthenticationContext from "../AuthenticationContext"
import CircularProgress from "@mui/material/CircularProgress";
import CenteredBox from "../tools/CenteredBox";
import {DataGrid} from '@mui/x-data-grid';
import Button from "@mui/material/Button";
import {endpoint} from "../consts";

const authFailPath = endpoint + "/api/core/auth/test/fail/v1";
const authPassPath = endpoint + "/api/core/auth/test/pass/v1";

// https://lokalise.com/blog/how-to-internationalize-react-application-using-i18next/
// https://lokalise.com/blog/react-i18n-intl/


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

    toggleState() {
        this.setState({
            open: !this.state.open
        })
    }

    arrow = () => this.state.open ? "↶" : "↷";

    render() {
        return <>
            <Button onClick={() => {this.toggleState()}}>{this.props.label} {this.arrow()}</Button>
            { this.state.open ? <div className="jsonBlock"><pre>{JSON.stringify(this.props.content, null, 4)}</pre></div> : null}
        </>
    }
}

export { CoreWelcome as CoreHello, JSONViewer }
