import React, {useState} from "react";
import Button from "@mui/material/Button";
import "./style.css"
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import CenteredLoader from "../../tools/CenteredLoader";
import DialogContentText from "@mui/material/DialogContentText";
import printJS from "print-js";
import {LoadingButton} from "@mui/lab";
import {SaveState} from "./AnnotationUI";

// SaveState, link, and that's it ;)

export default function SaveDialog(props) {
    const [loading, setLoading] = useState(false);

    const handlePrintArchiveLabel = () => {
        printJS({
            printable: props.printUrl,
            onLoadingStart: () => setLoading(true),
            onLoadingEnd: () => setLoading(false)
        })
    }

    const status = props.state === SaveState.Saving ? "Ukládání..." : props.state === SaveState.Saved ? "Uloženo" : "Nastala chyba :("
    return (
        <Dialog
            onClose={props.onClose}
            open={props.open}
            maxWidth={"sm"}
            fullWidth={true}
        >
            <DialogTitle>{status}</DialogTitle>
            <DialogContent>
                {props.state === SaveState.Saving && <CenteredLoader vertical={false}/>}
                {props.state === SaveState.Saved && <DialogContentText>Anotace byla uložena. Nyní můžete buďto vytisknout košilku (pokud je to potřeba), nebo pokračovat k další anotaci</DialogContentText>}
                {props.state === SaveState.Errored && <DialogContentText>Při ukládání nastala chyba. Více informací je v konzoli.</DialogContentText>}
            </DialogContent>
            {(props.state === SaveState.Saved || props.state === SaveState.Errored) && <DialogActions>
                {props.state === SaveState.Saved && props.printUrl && <LoadingButton loading={loading} onClick={handlePrintArchiveLabel} variant="outlined">Vytisknout košilku</LoadingButton>}
                {props.state === SaveState.Saved && <Button onClick={props.onClose} variant="contained">Další anotace</Button>}
                {props.state === SaveState.Errored && <Button color="error" onClick={props.onClose} variant="contained">Zavřít</Button>}
            </DialogActions>}
        </Dialog>
    )
}