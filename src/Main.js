import React, {Suspense} from 'react';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import {endpoint} from "./consts";
import LeftMenu from "./LeftMenu";
import AuthenticationContext from "./AuthenticationContext"
import IconButton from "@mui/material/IconButton";
import {Menu} from "@mui/icons-material";
import {v4 as uuidv4} from 'uuid';
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Stack from "@mui/material/Stack";

import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

import {allInternalRoutes, filterRoutes, groupEndpoints} from "./routes/routes";
import CenteredLoader from "./tools/CenteredLoader";


export default class Main extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            endpoints: null,
            alerts: []
        }
    }

    initLoad() {
        this.context.authenticatedFetch(endpoint + '/api/core/routes/v1')
            .then(r => {
                return r.json()
            })
            .then(parsedJson => {
                this.setState({endpoints: groupEndpoints(parsedJson)})
            })
            .catch((e) => {
                this.addAlert(e.toString(), "error", "Pico nejede to")
            });

    }

    // See https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/

    componentDidMount() {
        this.initLoad()
    }

    render() {
        const routes = this.state.endpoints === null ? {} : filterRoutes(allInternalRoutes, this.state.endpoints);
        const loggedIn = this.context.isUserLoggedIn();
        console.log(routes);
        const allRoutes = Object.entries(routes).flatMap(([categoryName, category]) => (category.children)).map((routeConfig) =>
            {
                const route = <Route path={routeConfig.path} key={routeConfig.path} element={React.createElement(routeConfig.element, {endpoints: this.state.endpoints})}/>;
                console.log(routeConfig.element);
                return route
            });


        return (<Router>
            <Box sx={{display: 'flex'}}>
                <CssBaseline/>
                <AppBar position="fixed" sx={{zIndex: (theme) => theme.zIndex.drawer + 1}}>
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                        >
                            <Menu />
                        </IconButton>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            Glued
                        </Typography>

                        <Button color="inherit" onClick={loggedIn ? this.handleLogout : this.handleLogin}>{loggedIn ? "Log out" : "Log in"}</Button>
                    </Toolbar>
                </AppBar>

                <LeftMenu routes={routes}/>



                <Box component="main" sx={{flexGrow: 1, p: 3}}>

                    <Toolbar/>
                    {this.state.alerts.size > 0 ? <Stack sx={{ width: '100%' }} spacing={2}>
                        {this.state.alerts.map(alert => {
                            return <Alert severity={alert.severity} onClose={() => {this.removeAlert(alert.uuid)}} key={alert.uuid} variant="filled">
                                {alert.title && <AlertTitle>{alert.title}</AlertTitle>}
                                {alert.text}
                            </Alert>
                        })}
                    </Stack> : null}


                    <Suspense fallback={<CenteredLoader/>}>
                        <Routes>
                            {allRoutes}
                        </Routes>
                    </Suspense>
                </Box>
            </Box></Router>
        );
    }

    handleLogout = () => this.context.logout();
    handleLogin = () => this.context.login();


    addAlert = (text, severity, title) => {
        const newAlert = {
            uuid: uuidv4(),
            text: text,
            severity: severity ?? 'info',
            title: title
        };

        this.setState( prevState => ({
            alerts: [newAlert, ...prevState.alerts]
        }))
    };

    removeAlert = (uuid) => {
        this.setState(prevState => ({
            alerts: prevState.alerts.filter(alert => alert.uuid !== uuid)
        }))
    }

}

Main.contextType = AuthenticationContext;