import {Component, createRef, LegacyRef, RefObject} from "react";
import "./Table.css"

class Table extends Component<any, any>{
    ref: RefObject<HTMLTableSectionElement>
    observer: ResizeObserver = null

    constructor(props) {
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
        this.observer.observe(this.ref.current, {})
    }

    componentWillUnmount() {
        this.observer.disconnect()
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

class ReadOnlyTableRow<T, X> {
    readonly id: string
    readonly label: string
    readonly width: string
    readonly render: (T) => null
    readonly getValue: (T) => X
}

export default Table;