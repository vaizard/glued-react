import * as React from 'react';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import {endpoint} from "./consts";
import LeftMenu from "./LeftMenu";




export default class ClipDrawer extends React.Component {

    // =================================
    // Constructor
    // =================================

    constructor(props) {
        super(props);
        this.state = {
            clicked: 0,
            routes: null,
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
        fetch(endpoint + '/api/skeleton/routes/tree/v1')
            .then(r => {
                return r.json()
            })
            .then(parsedJson => {
                this.setState({routes: parsedJson})
            })
            .catch((e) => {
                alert("pico nejedeto" + e)
            });

        fetch('' + endpoint + '/core/status/phpinfo')
            .then(r => {
                return r
            })
            .then(content => {
                this.setState({content: content})
            })
            .catch((e) => {
                alert("pico nejedeto" + e)
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
        return (
            <Box sx={{display: 'flex'}}>
                <CssBaseline/>
                <AppBar position="fixed" sx={{zIndex: (theme) => theme.zIndex.drawer + 1}}>
                    <Toolbar>
                        <Typography variant="h6" noWrap component="div">
                            Glued
                        </Typography>
                        <Button color="inherit" onClick={() => {
                            this.initLoad()
                        }} sx={{align: 'right'}}>Login</Button>
                    </Toolbar>
                </AppBar>

                <LeftMenu routes={this.state.routes}/>

                <Box component="main" sx={{flexGrow: 1, p: 3}}>
                    <Toolbar/>
                    <Typography paragraph>
                        {JSON.stringify(this.state.routes)}
                    </Typography>
                    <Typography paragraph>
                        { /* this.state.content.getElementById('body') */}
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
                </Box>
            </Box>
        );
    }

}