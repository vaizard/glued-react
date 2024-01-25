import React, {FC, useState} from "react";
import Button from "@mui/material/Button";

export interface JSONViewerProps {
    label: string,
    content: any
}

const JSONViewer: FC<JSONViewerProps> = (props) => {
    const [open, setOpen] = useState(false)
    const toggleOpen = () => {
        setOpen(!open)
    }


    const arrow = open ? "↶" : "↷";

    return <>
        <Button onClick={() => {
            toggleOpen()
        }}>{props.label} {arrow}</Button>
        {open ? <div className="jsonBlock">
            <pre>{JSON.stringify(props.content, null, 4)}</pre>
        </div> : null}
    </>
}
export default JSONViewer