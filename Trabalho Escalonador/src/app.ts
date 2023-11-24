import { ListValueProcess } from "./inputs/ListValueProcess"
import { ValueProcess } from "./inputs/ValueProcess"

// Verificador de Funcionamento/Chamamento
console.log("app está funcionando")

// Instâncias de Classes
let listInputProcess: ListValueProcess = new ListValueProcess()

// Elementos HTML para controle dinamicidade do código
let addProcessButton: HTMLElement | null = document.getElementById("addProcess")
let removeProcessButton: HTMLElement | null = document.getElementById("removeProcess")
let containerInputs: HTMLElement | null = document.getElementById("containerInputs")
let getProcessValues: HTMLElement | null = document.getElementById("getProcessValues")

// Variáveis
let sizeList: number = listInputProcess.lengthProcess // 0

let patternInput: string = '<div class="inputValues" id="values000">'+
                                'ID: 000 &nbsp;&nbsp;'+
                                '<label for="time000">Tempo</label>'          +'<input id="time000" type="number" placeholder="tempo" '           +'value="1"> &nbsp;'+                                    
                                '<label for="deadLine000">Deadline</label>'   +'<input id="deadLine000" type="number" placeholder="dead line"'    +'value="0"> &nbsp;'+
                                '<label for="page000">Páginas</label>'        +'<input id="page000" type="number" placeholder="páginas"'          +'value="1"> &nbsp;'+
                                '<label for="arrival000">Chegadas</label>'    +'<input id="arrival000" type="number" placeholder="chegadas"'      +'value="0"> &nbsp;'+
                            '</div>';

// EventListeners
addProcessButton!.addEventListener('click', function(){
    listInputProcess.addInput(0, 0, 0, 0)
    let patternInputCopy: string = patternInput.replace(/000/g, sizeList.toString())  // /0/g -> É uma expressão regular para substituir todas as aparições do caractere '0'
    if ( containerInputs ){
        containerInputs.innerHTML += patternInputCopy
    }
    sizeList++
})

removeProcessButton!.addEventListener('click', function(){
    if (  listInputProcess.lengthProcess > 0 ){
        let idLastProcess: number | undefined = listInputProcess.getLastProcess()?.id
        if ( idLastProcess !== undefined ){
            let idDivContainer: HTMLElement | null = document.getElementById("values"+idLastProcess)
            idDivContainer?.remove()
            listInputProcess.excludeInput()
        }
    }
})

getProcessValues!.addEventListener('click', function(){
    let listLength: number = listInputProcess.lengthProcess
    
    let schedulerProcess:  any = document.getElementById("processScheduler")
    let pagingMethod:  any = document.getElementById("pagingMethod")
    let quantum:  any = document.getElementById("quantum")
    let preemption:  any = document.getElementById("preemption")

    listInputProcess.config.scheduler = schedulerProcess.value
    listInputProcess.config.paging = pagingMethod.value
    listInputProcess.config.quantum = quantum.value
    listInputProcess.config.preemption = preemption.value

    let divIdString: string
    let processI: ValueProcess
    if( listLength > 0){
        for( let i:number = 0; i < listLength; i++){
            processI = listInputProcess.getOneProcess( i )!
            divIdString = processI.id.toString()

            let time: any = document.getElementById( "time" + divIdString )
            let deadLine: any = document.getElementById( "deadLine" + divIdString )
            let page: any = document.getElementById( "page" + divIdString )
            let arrival: any = document.getElementById( "arrival" + divIdString )

            listInputProcess.setImput(  parseInt( time.value, 10 ),
                                        parseInt( deadLine.value, 10 ),
                                        parseInt( page.value, 10 ),
                                        parseInt( arrival.value, 10 ),
                                        i
                                     )
        }
    }
    console.log(listInputProcess)
})
