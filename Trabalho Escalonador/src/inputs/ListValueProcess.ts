import { ValueProcess } from "./ValueProcess"
import { OtherValues } from "./OtherValues"

export class ListValueProcess {
    inputs: ValueProcess[] = []
    config: OtherValues = new OtherValues()

    constructor(){
        localStorage.thisInput = JSON.stringify(this.inputs)
    }

    get lengthProcess(){
        return this.inputs.length
    }

    addInput( time: number, deadLine: number, page: number, arrival: number ): void {
        let process: ValueProcess = new ValueProcess( time, deadLine, page, arrival)
        this.inputs.push(process)
    }

    setImput(time: number, deadLine: number, page: number, arrival: number, position: number ): void {
        let process: ValueProcess = this.inputs[position]
        process.time = time
        process.deadLine = deadLine
        process.page = page
        process.arrival = arrival
    }

    excludeInput(): void{
        this.inputs.pop()
    }

    getOneProcess( position: number ): ValueProcess | undefined {
        if( position >= this.lengthProcess )
            return undefined
        else
            return this.inputs[position]
    }

    getLastProcess(): ValueProcess | undefined {
        if( this.lengthProcess == 0 )
            return undefined
        else
            return this.inputs[ this.lengthProcess - 1 ]
    }

}