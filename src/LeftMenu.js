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
import Authentica from "@zelitomas/authentica.js"
import {useNavigate} from "react-router-dom";
import CenteredBox from "./tools/CenteredBox";
import CenteredLoader from "./tools/CenteredLoader";

const drawerWidth = 360;

export default function LeftMenu(props) {
    const {routes} = props;

    let navigate = useNavigate();
    let [openItem, setOpenItem] = useState(null);

    if(routes === null) {
        return <EmptyMenuDrawer/>
    }
    let buttons = [];
    let withoutGroup = null;
    for (const [groupName, groupObject] of Object.entries(routes)) {
        let subButtons = [];
        for (const route of groupObject.children) {
            subButtons.push(
                <ListItemButton key={route.name} sx={{pl: 4}} onClick={() => navigate(route.path)}>
                    <ListItemIcon>
                        <Star />
                    </ListItemIcon>
                    <ListItemText primary={route.label}/>
                </ListItemButton>
            )
        }

        const isOpen = openItem === groupName;

        // Objects without groups
        if(groupName === "") {
            withoutGroup = subButtons
        } else {
            buttons.push(
                <Fragment>
                    <ListItem button key={groupName} onClick={() => {
                        let newOpen = groupName === openItem ? "  " : groupName;
                        setOpenItem(newOpen)
                    }}>
                        <ListItemIcon>
                            <InboxIcon/>
                        </ListItemIcon>
                        <ListItemText primary={groupObject.label}/>
                        {isOpen ? <ExpandLess/> : <ExpandMore/>}


                    </ListItem>
                    <Collapse in={isOpen} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {subButtons}

                        </List>
                    </Collapse>
                </Fragment>
            )
        }
    }


    return <MenuDrawer>
            <List>
                {buttons}
                {withoutGroup !== null ?
                    <Fragment>
                        <Divider/>
                        {withoutGroup}
                    </Fragment>
                : null
                }
            </List>
    </MenuDrawer>
}

function EmptyMenuDrawer() {
    return <MenuDrawer>
        <CenteredLoader/>
    </MenuDrawer>
}

function MenuDrawer(props) {
    const {children} = props;
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
            {children}
        </Box>
    </Drawer>
}

function dummyNavigate(location){
    window.location = location
}