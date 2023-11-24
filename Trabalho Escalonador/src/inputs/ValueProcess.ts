export class ValueProcess {
    private static countId = 0
    private _id: number
    private _time: number
    private _deadLine: number
    private _page: number
    private _arrival: number

    constructor( time: number, deadLine: number, page: number, arrival: number ){
        this._time = time
        this._deadLine = deadLine
        this._page = page
        this._arrival = arrival
        this._id = ValueProcess.countId
        ValueProcess.countId++
    }

    get time():number {
        return this._time
    }
    set time( time: number ){
        this._time = time
    }

    get deadLine():number {
        return this._deadLine
    }
    set deadLine( deadLine: number ){
        this._deadLine = deadLine
    }

    get page():number {
        return this._page
    }
    set page( page: number ){
        this._page = page
    }
    
    get arrival():number {
        return this._arrival
    }
    set arrival( arrival: number ){
        this._arrival = arrival
    }

    get id(): number {
        return this._id
    }
}