import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon/ListItemIcon";
import InboxIcon from '@mui/icons-material/MoveToInbox';
import Drawer from "@mui/material/Drawer/Drawer";
import * as React from "react";
import {useState} from "react";
import {endpoint} from "./consts";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import {ExpandLess, ExpandMore, Star} from "@mui/icons-material";
import ListItemButton from "@mui/material/ListItemButton";
import {Fragment} from "react";

const drawerWidth = 360;


export default function LeftMenu(props) {
    const {routes} = props;
    let [openItem, setOpenItem] = useState(null);
    let buttons = [];
    for (const [groupName, groupObject] of Object.entries(routes?.be?.children ?? {})) {
        let subButtons = [];
        for (const route of groupObject.children) {
            subButtons.push(
                <ListItemButton key={route.node.name} sx={{pl: 4}} onClick={() => dummyNavigate(endpoint + route.node.url)}>
                    <ListItemIcon>
                        <Star />
                    </ListItemIcon>
                    <ListItemText primary={route.node.label}/>
                </ListItemButton>
            )
        }

        const open = openItem === groupName;

        buttons.push(
            <Fragment>
                <ListItem button key={groupName} onClick={() => {
                    setOpenItem(groupName)
                }}>
                    <ListItemIcon>
                        <InboxIcon/>
                    </ListItemIcon>
                    <ListItemText primary={groupName}/>
                    {open ? <ExpandLess/> : <ExpandMore/>}


                </ListItem>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {subButtons}

                    </List>
                </Collapse>
            </Fragment>
        )


    }


    return <Drawer
        variant="permanent"
        sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {width: drawerWidth, boxSizing: 'border-box'},
        }}
    >
        <Toolbar/>
        <Box sx={{overflow: 'auto'}}>
            <List>
                {buttons}
            </List>
            <Divider/>
        </Box>
    </Drawer>
}

function dummyNavigate(location){
    window.location = location
}