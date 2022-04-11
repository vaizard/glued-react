import Button from '@mui/material/Button';
import Drawer from './Drawer'
import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import CenteredBox from "./tools/CenteredBox";
import Authenticator from "@zelitomas/authentica.js";
import {authenticatorOptions} from "./consts";
import AuthenticationContext from "./AuthenticationContext"

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

// Temp workaround
const isUserLoggerIn = () => !!localStorage.getItem("access_token");


class App extends React.Component{

  constructor(props) {
    super(props);

    this.state = {
      loginInitializing: true,
      authenticated: false
    };
    this.authenticator = new Authenticator(authenticatorOptions)
  }

  componentDidMount = () => {
    this.startAuthentication()
  };

  startAuthentication = async () => {
    const result = await this.authenticator.checkLogin();
    this.setState({
      loginInitializing: false,
      authenticated: isUserLoggerIn()
    })
  }

  render = () => {
    if(this.state.loginInitializing) {
      return <CenteredBox>
          <CircularProgress />
      </CenteredBox>
    }
    if(!this.state.authenticated) {
      return <CenteredBox>
        <Button variant="contained" onClick={() => this.authenticator.initiateLogin()}>Login</Button>
      </CenteredBox>
    }

    return <AuthenticationContext.Provider value={this.authenticator}>
      <Drawer/>
    </AuthenticationContext.Provider>
  }

}

export default App;
