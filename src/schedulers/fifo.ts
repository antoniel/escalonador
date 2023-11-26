import ChartBoxEnum from "@/types/ChartBoxEnum"
import { IProcess, Scheduler } from "@/types/types"

class FIFOScheduler implements Scheduler {
  // Método para agendar processos usando o algoritmo FIFO (First In, First Out)
  public schedule(processes: IProcess[]) {
    // Cria uma fila de processos, copiando e ordenando-os pelo tempo de chegada
    const processesQueue = [...processes]
      .map((obj) => Object.assign({}, obj))
      .sort((p1, p2) => p1.arrivalTime - p2.arrivalTime)

    const schedule: Array<ChartBoxEnum | number> = [] // Array para armazenar o agendamento
    let currentProcess: IProcess
    let currentMomentOfExecution = 0 // Tempo atual na execução

    // Enquanto houver processos na fila
    while (processesQueue.length !== 0) {
      currentProcess = processesQueue.shift() as IProcess // Obtém o próximo processo

      // Preenche os tempos vazios até a chegada do processo atual
      while (currentProcess.arrivalTime > currentMomentOfExecution) {
        schedule[currentMomentOfExecution] = ChartBoxEnum.Empty
        currentMomentOfExecution++
      }

      // Processa o tempo de execução do processo atual
      while (currentProcess.executionTime !== 0) {
        schedule[currentMomentOfExecution] = currentProcess.id
        currentProcess.executionTime -= 1
        currentMomentOfExecution++
      }
    }

    return schedule // Retorna o agendamento completo
  }
}

export default FIFOScheduler
