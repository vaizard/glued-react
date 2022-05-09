import React, {Suspense, lazy} from 'react';
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
import { v4 as uuidv4 } from 'uuid';
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Stack from "@mui/material/Stack";
import plugins from "./plugins.config"

import {BrowserRouter as Router, Routes, Route, useNavigate} from 'react-router-dom';
import CenteredBox from "./tools/CenteredBox";
import CircularProgress from "@mui/material/CircularProgress/CircularProgress";

let routes = {};

function createRoutesCategory(categories, categoryName){
    categoryName = categoryName ?? "";
    if (!(categoryName in categories) ) {
        categoryName = ""
    }

    if (categoryName in routes) {
        return routes[categoryName];
    }

    routes[categoryName] = {
        children: []
    };

    const label = categories[categoryName]?.label;

    if(label !== null){
        routes[categoryName].label  = label
    }

    return routes[categoryName];

}


for (let plugin of plugins.plugins ?? []) {

    let category = createRoutesCategory(plugins.categories, plugin?.category ?? null);
    console.log(plugins.plugin)
    category.children.push({
        name: plugin.plugin.name,
        label: plugin.plugin.label,
        // WebPack doesn't support full dynamic imports :facepalm:
        element: plugin.plugin.module,
        path: plugin.path
    })

}


console.log(routes)


export default class ClipDrawer extends React.Component {

    // =================================
    // Constructor
    // =================================

    constructor(props) {
        super(props);
        this.state = {
            clicked: 0,
            //routes: null,
            alerts: []
        }
    }

    // =================================
    // Methods
    // =================================

    handleClick() {
        this.setState({
            clicked: this.state.clicked + 1
        })
    }

    initLoad() {
        /*this.context.authenticatedFetch(endpoint + '/api/skeleton/routes/tree/v1')
            .then(r => {
                return r.json()
            })
            .then(parsedJson => {
                this.setState({routes: parsedJson})
            })
            .catch((e) => {
                this.addAlert(e.toString(), "error", "Pico nejede to")
            });*/

        this.context.authenticatedFetch('' + endpoint + '/core/status/phpinfo')
            .then(r => {
                return r
            })
            .then(content => {
                this.setState({content: content})
            })
            .catch((e) => {
                this.addAlert(e.toString(), "error", "Pico nejede to")
            })

    }

    // =================================
    // Lifecycle
    // =================================

    // See https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/

    componentDidMount() {
        this.initLoad()
    }

    render() {
        const allRoutes = Object.entries(routes).flatMap(([categoryName, category]) => (category.children)).map((routeConfig) =>
        {


            const route = <Route path={routeConfig.path} element={React.createElement(routeConfig.element)}/>
            console.log(routeConfig.element)
            return route
        })

        console.log(allRoutes)


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
                        <Button color="inherit" onClick={this.handleLogout}>Logout</Button>
                    </Toolbar>
                </AppBar>

                <LeftMenu routes={routes}/>



                <Box component="main" sx={{flexGrow: 1, p: 3}}>

                    <Toolbar/>


                        <Suspense fallback={<Loader/>}>
                            <Routes>
                                {allRoutes}
                            </Routes>
                        </Suspense>



                    <Stack sx={{ width: '100%' }} spacing={2}>
                        {this.state.alerts.map(alert => {
                            return <Alert severity={alert.severity} onClose={() => {this.removeAlert(alert.uuid)}} key={alert.uuid} variant="filled">
                                {alert.title && <AlertTitle>{alert.title}</AlertTitle>}
                                {alert.text}
                            </Alert>
                        })}
                    </Stack>


                </Box>
            </Box></Router>
        );
    }

    handleLogout = () => this.context.logout()

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
    }

    removeAlert = (uuid) => {
        this.setState(prevState => ({
            alerts: prevState.alerts.filter(alert => alert.uuid !== uuid)
        }))
    }

}

const Loader = (props) => {
    return <CenteredBox>
        <CircularProgress />
    </CenteredBox>
}

const Ipsum = (props) => (
    <Typography paragraph>
        Consequat mauris nunc congue nisi vitae suscipit. Fringilla est ullamcorper
        eget nulla facilisi etiam dignissim diam. Pulvinar elementum integer enim
        neque volutpat ac tincidunt. Ornare suspendisse sed nisi lacus sed viverra
        tellus. Purus sit amet volutpat consequat mauris. Elementum eu facilisis
        sed odio morbi. Euismod lacinia at quis risus sed vulputate odio. Morbi
        tincidunt ornare massa eget egestas purus viverra accumsan in. In hendrerit
        gravida rutrum quisque non tellus orci ac. Pellentesque nec nam aliquam sem
        et tortor. Habitant morbi tristique senectus et. Adipiscing elit duis
        tristique sollicitudin nibh sit. Ornare aenean euismod elementum nisi quis
        eleifend. Commodo viverra maecenas accumsan lacus vel facilisis. Nulla
        posuere sollicitudin aliquam ultrices sagittis orci a.


    </Typography>
)

ClipDrawer.contextType = AuthenticationContext;