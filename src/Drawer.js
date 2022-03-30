import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import Button from '@mui/material/Button';
import ListItemButton from '@mui/material/ListItemButton';
import StarBorder from '@mui/icons-material/StarBorder';
import Icon from '@mui/material/Icon';
import iconMap from './IconMap';


const drawerWidth = 360;

export default class ClipDrawer extends React.Component {

  // =================================
  // Constructor
  // =================================

  constructor(props) {
    super(props)
    this.state = {
      clicked : 0,
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
    fetch('https://10.146.149.186:8001/api/skeleton/routes/tree/v1')
      .then(r => {return r.json()})
      .then(parsedJson => {this.setState({routes: parsedJson})})
      .catch((e) => { alert("pico nejedeto" + e)} )

      fetch('https://10.146.149.186:8001/core/status/phpinfo')
      .then(r => {return r})
      .then(content => {this.setState({content: content})})
      .catch((e) => { alert("pico nejedeto" + e)} )

  }

  // =================================
  // Lifecycle
  // =================================

  // See https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/

  componentDidMount() {
    this.initLoad()
  }

  render() {
    let buttons = []
    for(const [groupName, groupObject] of Object.entries(this.state.routes?.be?.children ?? {})) {

      buttons.push(<ListItem button key={groupName}>
            <ListItemIcon>
              <InboxIcon />
            </ListItemIcon>
            <ListItemText primary={groupName} sx={{ color: 'red' }} />
          </ListItem >
        )
      

      for(const route of groupObject.children) {
        buttons.push(<ListItem button key={route.node.name}>
            <ListItemIcon>
              <Icon>star</Icon>;
            </ListItemIcon>
            <a href={'https://10.146.149.186:8001' + route.node.url}><ListItemText primary={route.node.label} /></a>
          </ListItem >
        )
      }
      
    }
    return (
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <Typography variant="h6" noWrap component="div">
              Glued
            </Typography>
            <Button color="inherit" onClick={ () => {this.initLoad()} } sx={{ align: 'right' }}>Login</Button>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: 'auto' }}>
            <Button variant="contained" onClick={ () => {this.initLoad()} } >{ this.state.clicked }</Button>
            <List>
              {/*['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                <ListItem button key={text}>
                  <ListItemIcon>
                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItem>
              ))*/}

              { buttons }
            </List>
            <Divider />
            <List>
              {['All mail', 'Trash', 'Spam'].map((text, index) => (
                <ListItem button key={text}>
                  <ListItemIcon>
                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItem>
              ))}
              
                <List component="div" disablePadding>
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <StarBorder />
                    </ListItemIcon>
                    <ListItemText primary="Starred" />
                  </ListItemButton>
                </List>
              

            </List>
          </Box>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          <Typography paragraph>
            { JSON.stringify(this.state.routes) }
          </Typography>
          <Typography paragraph>
            { /* this.state.content.getElementById('body') */ }
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