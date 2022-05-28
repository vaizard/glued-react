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
import Authentication from "./Authentication";


class App extends React.Component{

  constructor(props) {
    super(props);

    this.state = {
      loginInitializing: true,
      authenticated: false
    };

    this.authentication = new Authentication()
  }

  componentDidMount = () => {
    this.authentication.addEventListener("accessTokensExpired", this.handleAccessTokenExpired)
    this.startAuthentication()
  };


  startAuthentication = async () => {
    await this.authentication.authenticator.checkLogin();
    this.setState({
      loginInitializing: false,
      authenticated: this.authentication.isUserLoggedIn()
    })
  };

  handleAccessTokenExpired = async () => {
    this.setState({
      loginInitializing: true
    });
    await this.authentication.authenticator.logout();
    await this.startAuthentication()
  }

  render = () => {
    if(this.state.loginInitializing) {
      return <CenteredBox>
          <CircularProgress />
      </CenteredBox>
    }
    if(!this.state.authenticated) {
      return <CenteredBox>
        <Button variant="contained" onClick={() => this.authentication.authenticator.initiateLogin()}>Login</Button>
      </CenteredBox>
    }

    return <AuthenticationContext.Provider value={this.authentication}>
      <Drawer/>
    </AuthenticationContext.Provider>
  }

}

export default App;
