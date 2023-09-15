import React from 'react';
import AuthenticationContext from "../../AuthenticationContext"
import * as pdf from "pdfjs-dist/build/pdf";
// noinspection ES6UnusedImports
import * as worker from "pdfjs-dist/build/pdf.worker.entry"
import Dropzone from "react-dropzone";
import {Paper} from "@mui/material";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import IconButton from "@mui/material/IconButton";
import DownloadIcon from '@mui/icons-material/Download';
import {downloadUnit8Array} from "./utils";
import * as fakturXPackage from "@fakturx/fakturx-parser"

const FakturXTest = fakturXPackage.cz.vybehpelikanu.fakturx.FakturXtest


class PDFAttachment extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            content: null
        }
    }

    onDrop = (files) => {
        window.dropped = files

        this.setState({content: files})
    };

    reset = () => {
        this.setState({content: null})
    }

    render() {
        if(this.state.content === null) {
            return <Dropzone onDrop={this.onDrop}>
                {({getRootProps, getInputProps, isFocused, isDragAccept, isDragReject}) => (

                    <div {...getRootProps({className: 'dropzone'})}>
                        <DropBox focused={isFocused} accepting={isDragAccept} rejecting={isDragReject}/>
                        <input {...getInputProps()} />
                    </div>

                )}
            </Dropzone>

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
        this.loadPdf().then((attachments) => {
            window.attachments = attachments
            const decoder = new TextDecoder()
            const xmlParser = new FakturXTest()
            try {
                if(attachments !== null) {
                    window.parsed = Object.entries(attachments)
                         .map(([name, file]) => (decoder.decode(file.content)))
                         .map((text) => (xmlParser.decodeXml(text)))
                }

            } catch (e) {

            }

            this.setState({attachments: attachments, processing: false})
        }).catch((reason) => {
            this.setState({ error: reason, processing: false})
        })
    }

    async loadPdf() {
        let arrayBuffer = await this.props.file.arrayBuffer()
        let parsedPdf = await pdf.getDocument(arrayBuffer).promise
        return await parsedPdf.getAttachments()
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

function DropBox(props) {
    //alert(props.focused)
    return <Paper
        elevation={props.accepting ? 3 : 1}
        style={{
            textAlign: 'center',
            padding: '40px',
        }}
    >
        Sem přetáhněte soubory
    </Paper>
}


export default PDFAttachment
PDFAttachment.contextType = AuthenticationContext;
