import React from 'react';
import AuthenticationContext from "../../AuthenticationContext"
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import IconButton from "@mui/material/IconButton";
import DownloadIcon from '@mui/icons-material/Download';
import {downloadUnit8Array} from "./utils";
import {getPDFAttachment} from "./pdf/pdf";
import DropBox from "../../components/DropBox";
import {parseAttachment, selectAttachment} from "../facturx/parser";
//import {parseAttachment, selectAttachment} from "../facturx/parser";



class PDFAttachment extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            content: null
        }
    }

    onDrop = (files) => {
        this.setState({content: files})
    };

    reset = () => {
        this.setState({content: null})
    }

    render() {
        if(this.state.content === null) {
            return <DropBox onDrop={this.onDrop} />
        }

        return <Stack spacing={2}>
            <DocumentAttachmentViewer file={this.state.content[0]} />
            <Button variant="contained" onClick={this.reset}>Upload another</Button>
        </Stack>


    }
}

class DocumentAttachmentViewer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            processing: true,
            attachments: null,
            error: null
        }
    }

    componentDidMount() {

        getPDFAttachment(this.props.file).then((attachments) => {

            try {
                const attachment = selectAttachment(attachments)
                window.parsed = parseAttachment(attachment)
                alert(window.parsed.totalPrice)

            } catch (e) {

            }

            this.setState({attachments: attachments, processing: false})
        }).catch((reason) => {
            this.setState({ error: reason, processing: false})
        })
    }

    downloadAttachment = async (name) => {
        const attachment = this.state.attachments[name]
        downloadUnit8Array(attachment.content, attachment.filename)
    }

    render() {
        if(this.state.processing) {
            return <CircularProgress/>
        }

        if (this.state.error !== null) {
            return <Alert severity="error" >There was an error when processing the file. See the console for more info. {this.state.error}</Alert>;
        }

        const attachmentEntries = this.state.attachments !== null ? Object.entries(this.state.attachments) : []

        if (attachmentEntries.length <= 0) {
            return <Alert severity="warning" >There was no attachment in this file :( {this.state.error}</Alert>;
        }

        return <List>
            {
                attachmentEntries.map(([name, object]) => (
                    <ListItem
                        secondaryAction={
                            <IconButton edge="end" onClick={() => {this.downloadAttachment(name)}}>
                                <DownloadIcon/>
                            </IconButton>
                        }
                    >
                        {name}

                    </ListItem>
                ))
            }


        </List>;



    }
}



export default PDFAttachment
PDFAttachment.contextType = AuthenticationContext;
