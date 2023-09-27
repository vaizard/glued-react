import Dropzone, {DropEvent, FileRejection} from "react-dropzone";
import {Paper} from "@mui/material";
import React from "react";

interface DropBoxProps {
    onDrop?: (acceptedFiles: File[], fileRejections: FileRejection[], event: DropEvent) => void
}

export default function DropBox({onDrop}: DropBoxProps) {
    return <Dropzone onDrop={onDrop}>
        {({getRootProps, getInputProps, isFocused, isDragAccept, isDragReject}) => (

            <div {...getRootProps({className: 'dropzone'})}>
                <DropSurface focused={isFocused} accepting={isDragAccept} rejecting={isDragReject}/>
                <input {...getInputProps()} />
            </div>

        )}
    </Dropzone>
}

interface SurfaceProps {
    focused?: boolean;
    accepting?: boolean;
    rejecting?: boolean;
}

function DropSurface(props: SurfaceProps) {
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
