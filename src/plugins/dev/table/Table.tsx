import React, {Component, createRef, RefObject} from "react";
import "./Table.css"

class Table extends Component<any, any>{
    ref: RefObject<HTMLTableSectionElement>
    observer: ResizeObserver | null = null

    constructor(props: any) {
        super(props);
        this.ref = createRef()

        this.state = {
            width: null,
            height: null,
        }
    }

    onContextMenu = (e: Event) => {
        e.preventDefault()
    }

    componentDidMount() {
        this.observer = new ResizeObserver(this.handleSizeChange)
        // @ts-ignore
        this.observer.observe(this.ref.current, {})
    }

    componentWillUnmount() {
        this.observer?.disconnect()
    }

    handleSizeChange: ResizeObserverCallback = (entries) => {
        for (const entry of entries) {
            if(entry.target === this.ref.current) {
                const boxSize = entry.contentBoxSize[0]
                this.setState({ height: boxSize.blockSize, width: boxSize.inlineSize })
                console.log(boxSize)
            }
        }
    }

    render() {
        return <div className="xTable">
            <table>
                <thead>Hello</thead>
                <tbody ref={this.ref}>
                    <Boxes count={Math.floor(this.state.height / 15)} height={15}/>
                </tbody>
            </table>
            {/**/}
        </div>;
    }
}


// @ts-ignore
function Boxes({count, height}) {
    return <div>
        {
            // @ts-ignore
            [...range(count)].map(it => <div style={{height: height, backgroundColor: it % 2 == 0 ? "blue" : "powderblue"}}></div>)

        }
    </div>
}

function* range(upperBound: number) {
    for(let i = 0; i < upperBound; i++) {
        yield i;
    }
}

abstract class ReadOnlyTableRow<T, X> {
    readonly id: string = ""
    readonly label: string = ""
    readonly width: string = ""
    abstract readonly render: (arg0: T) => null
    abstract readonly getValue: (arg0: T) => X

}

export default Table;