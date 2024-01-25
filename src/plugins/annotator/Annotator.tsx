import AnnotationUI from "./AnnotationUI";
import React, {FC, useContext} from "react";
import {PluginProps} from "../../types/plugins";
import AuthenticationContext from "../../AuthenticationContext";
import {relative, useData} from "../../utils";
import CircularProgress from "@mui/material/CircularProgress";
import CenteredBox from "../../tools/CenteredBox";

const Annotator: FC<PluginProps> = (props) => {
    const authenticationContext = useContext(AuthenticationContext)
    const taskEndpoint = props.endpoints.get("be_annotations_task_v1")

    const [task, loading, refresh] = useData<AnnotationTask>(taskEndpoint?.url, authenticationContext?.authenticatedFetch)


    if(loading) {
        return <CenteredBox><CircularProgress /></CenteredBox>
    }

    if(task === null) {
        return <>All done :)</>
    }

    if(taskEndpoint === undefined || authenticationContext === null) {
        return <>Error :(</>
    }

    const saveAnnotation = async (annotation: Annotation | RejectedAnnotation) => {
        const endpoint = relative(taskEndpoint.url, task.uuid)
        try {
            const result = await authenticationContext?.authenticatedFetch(endpoint, {
                method: 'POST',
                headers: {'Content-Type': 'application/json' },
                body: JSON.stringify(annotation),
            })

            if(!result.ok) {
                alert(`Ukládání selhalo - API vrátilo ${result.status}. Více info v konzoli.`)
                console.error(result)
            }
        } catch (e) {
            alert("Ukládání selhalo. Více info v konzoli.")
            console.error(e)
        } finally {
            refresh()
        }
    }


    return <AnnotationUI key={task.uuid} task={task} {...props}
                         onSave={(annotation: Annotation) => saveAnnotation(annotation)}
                         onReject={() => saveAnnotation({error: "Annotation rejected"})}
                         initialInput = {task.regIdCandidates.join("|")}


    />
}

interface AnnotationTask {
    uuid: string
    document: string
    pdf: string
    regIdCandidates: string[]
}


interface Counterparty {
    name: string,
    ico: string,
    dic?: string,
}

interface Annotation {
    currency: string,
    counterparty: Counterparty,
    description?: string,
    duzp: string,
    withVAT: string,
    withoutVAT: string,
}

interface RejectedAnnotation {
    error: string
}

export default Annotator