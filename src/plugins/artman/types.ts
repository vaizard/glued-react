
export interface Analytic {
    code: string,
    name: string,
    uuid: string,
    nonce: string
}

export type AnalyticUpdate = Omit<Analytic, "nonce">

export class AnalyticRow {
    public analytic: Analytic;
    public isNew: boolean;
    constructor(analytic: Analytic, isNew: boolean) {
        this.analytic = analytic
        this.isNew = isNew
    }
    public get code() { return this.analytic.code }
    public get name() { return this.analytic.name }
    public get uuid() { return this.analytic.uuid }
    public set code(val) { this.analytic.code = val }
    public set name(val) { this.analytic.name = val }
    public set uuid(val) { this.analytic.uuid = val }
}