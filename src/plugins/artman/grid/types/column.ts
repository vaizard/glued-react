


type ColumnType = 'string' | 'number';

export interface MagicGridColumn<T> {
    getter: (it: T) => any,
    name: string,
    id: string,

    type?: ColumnType,  // TODO: split
    // TODO: render?: (it) => ReactNode
    width?: number,
    /**
     * Only makes sense if the grid itself is editable.
     * Default is `false`
     */
    readOnly?: boolean
}
