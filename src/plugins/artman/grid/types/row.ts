export enum RowState {
    // Dirty states
    New,
    Modifying,
    Deleting,

    // Clean states
    Saved,

}

export class RowStateUtil {
    public static isDirty(state: RowState) {
        return state !== RowState.Saved
    }
}

export interface Row<T> {
    id: string // TODO: generalize
    nonce: string // TODO: generalize
    state: RowState
    data: Record<string, any>
}