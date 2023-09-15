import React from 'react';
import CircularProgress from "@mui/material/CircularProgress";
import {DataGrid} from "@mui/x-data-grid";
import CenteredBox from "../../tools/CenteredBox";
import Dialog from "@mui/material/Dialog";
import {Grid, Paper, styled, Tooltip} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import EditIcon from '@mui/icons-material/Edit';
import AuthenticationContext from "../../AuthenticationContext";
import TableChartIcon from '@mui/icons-material/TableChart';
import DialogTitle from "@mui/material/DialogTitle";
import ListItem from "@mui/material/ListItem";
import List from '@mui/material/List';
import ListItemButton from "@mui/material/ListItemButton";

function groupBy (array, keyGetter) {
    let result = {}
    for(const x of array) {
        const key = keyGetter(x)
        const toAppend = result[key] || []
        toAppend.push(x)
    }

    return result
}

const assignBy = (iterable, keyGetter) => (
    iterable.reduce((accumulator, newValue) => {
        accumulator[keyGetter(newValue)] = newValue
        return accumulator
    }, {})
)


function foldPacklists(packlists) {
    const packlistsById = assignBy(packlists, (it) => it.name)

    const childPacklistIds = new Set(
        packlists
            .flatMap((packlist => packlist.set.items))
    )



    console.log(childPacklistIds)

    const parentPacklists = packlists//.filter(it => !childPacklistIds.has(it.name))

    return parentPacklists.map( it => {
        it.set.items = it.set.items.map(subPacklistName => packlistsById[subPacklistName])
        return it
    })
}

export default class Packlists extends React.Component {


    constructor(props) {
        super(props);
        this.endpoint = props.endpoints.get("be_fare_packlists_v3").url
        this.state = {
	        content: null,
            selected: null,
        }
    }

    componentDidMount() {
        this.context.authenticatedFetch(this.endpoint)
	        .then(response => response.json())
            .then(content => content.data) // Unpack that stupid redundant envelope
            .then(packlists => foldPacklists(packlists))
	        .then(packlists => { this.setState({content: packlists}) } )
    }

    handleClose() {
        this.setState({selected: null})
    }

    setPackList(e, packlist) {
        e.stopPropagation();
        this.setState({selected: packlist})
    }

    packlistByUuid(uuid) {
        if(uuid == null) {
            return null
        }
        return this.state.content.find(it => it.uuid === uuid) ?? null
    }

    closeDialog = (selectedItem) => {
        this.setState({selected: selectedItem})
    }

    render() {
        const currentPacklist = this.packlistByUuid(this.state.selected)

        if ( this.state.content === null ) {
            return <CenteredBox>
                <CircularProgress />
            </CenteredBox>
        }

        const rows = this.state.content//?.filter(it => it?.set?.items.length > 0);

        const columns = [
            { field: 'name', headerName: 'ID', width: '100'},
            { field: 'description', headerName: 'Název', width: '300', renderCell: (params) => {
                return <>
                    { params.row.description }
                    { params.row.set.items.length > 0 ? <TableChartIcon /> : null }
                </>
            }},
            { field: 'actions', headerName: '', width: 50, sortable: false, renderCell: (params) => {
                return <Tooltip title="Editace zatím není povolena">
                    <span><IconButton disabled={false} onClick={(e) => this.setPackList(e, params.row.uuid)}><EditIcon /></IconButton></span>
                </Tooltip>

            }},
            { field: 'subitems', headerName: 'Síta', width: '50', valueGetter: (params) => (params.row.set.items.length)},
            { field: 'replicas', headerName: 'Počet', width: '75'},
            { field: 'revision', headerName: 'Revize', width: '500'},
            { field: 'ref', headerName: 'Reference', width: '500'},
            { field: 'sku', headerName: 'SKU', width: '500'},
            { field: 'qty', headerName: 'Počet', width: '500' },
        ];


        return ( <>
            {currentPacklist && <SetView sets={currentPacklist?.set?.items} open={currentPacklist?.set?.items.length > 0} onClose={this.closeDialog} />}
            Current packlist: {currentPacklist?.uuid}
            <div style={{ height: 800, width: '100%' }}>
                <DataGrid rows={rows} columns={columns} getRowId={it => it.name}/>
            </div>
        </> );
    }
}

Packlists.contextType = AuthenticationContext


const empty = () => {}
function SetView({sets, open, onClose}) {
    onClose = onClose ?? empty;
    return <Dialog onClose={onClose} open={open}>
        <DialogTitle>Vyberte síto</DialogTitle>
        <List>
            { sets.map(it =>
                <ListItem key = {it.uuid}>
                    <ListItemButton onClick={() => onClose(it.uuid)}>
                        <SingleSet set={it}/>
                    </ListItemButton>
                </ListItem>
            ) }
        </List>

    </Dialog>
}

const Img = styled('img')({
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
});


function SingleSet({set}) {
    return <Grid container spacing={2}>
        <Grid xs={3} item>
            <Img alt="complex" src={"https://source.unsplash.com/random/200x200/?medical"} />
        </Grid>
        <Grid item xs={9}>
            This is {set.name}
        </Grid>
    </Grid>
}