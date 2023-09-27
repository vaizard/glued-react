import Form from '@rjsf/mui';
import React from "react";
import ListItem from "@mui/material/ListItem";
import {v4 as uuidv4} from 'uuid';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';




const schema = {
    title: "Todo",
    type: "object",
    required: ["title"],
    properties: {
        title: {type: "string", title: "Title", default: "A new task"},
        done: {type: "boolean", title: "Done?", default: false}
    }
};


class HereBeDemo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listItems: {}
        }
    }

    handleSubmit = (formData) => {
        let newTodo = {};
        newTodo[uuidv4()] = formData;
        this.setState( prevState => ({
            listItems: {...prevState.listItems, ...newTodo}
        }))
    };

    render() {
        let listItems = [];
        for(const [itemId, item] of Object.entries(this.state.listItems)){
            listItems.push(<ListItem key={itemId} disablePadding>
                <ListItemButton role={undefined} onClick={() => this.handleToggle(itemId)} dense>
                    <ListItemIcon>
                        <Checkbox
                            edge="start"
                            checked={item.done}
                            tabIndex={-1}
                            disableRipple
                        />
                    </ListItemIcon>
                    <ListItemText primary={`${item.title}`} />
                </ListItemButton>
            </ListItem>)
        }



        return <>
            {listItems.length > 0 && <List>{listItems}</List>}
            <Form
                schema={schema}
                onSubmit={x => this.handleSubmit(x.formData)}
            />
        </>
    }

    handleToggle(itemId) {
        let newTodo = {};
        newTodo[itemId] =  {...this.state.listItems[itemId]};
        newTodo[itemId].done = !newTodo[itemId].done;

        this.setState({listItems: {...this.state.listItems, ...newTodo}})
    }

}



export default HereBeDemo;