import { IProcess, Scheduler } from "@/types/types"
import ChartBoxEnum from "../types/ChartBoxEnum"

export default class EDFScheduler implements Scheduler {
  // Método para agendar processos usando o algoritmo Earliest Deadline First (EDF)
  public schedule(processes: IProcess[], quantum = 2, overheadTime = 1): number[] {
    // Clona o array de processos para não modificar o original
    const _processes: IProcess[] = processes.map((process) => ({ ...process }))

    const schedule: number[] = [] // Array para armazenar o agendamento
    let currentMomentOfExecution = 0 // Tempo atual na execução

    // Enquanto houver processos
    while (_processes.length > 0) {
      // Filtra os processos que já chegaram até o momento atual
      const arrivedProcesses = _processes.filter((process) => process.arrivalTime <= currentMomentOfExecution)

      // Se não há processos que chegaram, avança o tempo
      if (arrivedProcesses.length === 0) {
        schedule.push(ChartBoxEnum.Empty)
        currentMomentOfExecution++
        continue
      }

      // Seleciona o processo com o menor deadline
      const currentProcess = this.getEarliestDeadlineProcess(arrivedProcesses)

      // Processa o quantum ou o tempo de execução restante, o que for menor
      const processIterations = Math.min(currentProcess.executionTime, quantum)
      for (let i = 0; i < processIterations; i++) {
        schedule.push(currentProcess.id)
        currentMomentOfExecution++
        currentProcess.executionTime--
      }

      // Se ainda resta tempo de execução, adiciona overhead
      if (currentProcess.executionTime > 0) {
        for (let i = 0; i < overheadTime; i++) {
          schedule.push(ChartBoxEnum.OverHead)
          currentMomentOfExecution++
        }
      } else {
        // Remove o processo da lista se ele terminou
        const index = _processes.indexOf(currentProcess)
        _processes.splice(index, 1)
      }
    }

    return schedule
  }

  // Método privado para obter o processo com o deadline mais próximo
  private getEarliestDeadlineProcess(processes: IProcess[]): IProcess {
    // Retorna o processo com o menor deadline
    return processes.reduce((earliest, process) =>
      process.deadline < (earliest.deadline ?? Infinity) ? process : earliest
    )
  }
}
