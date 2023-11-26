import { IProcess, Scheduler } from "@/types/types"
import ChartBoxEnum from "../types/ChartBoxEnum"

export default class SJFScheduler implements Scheduler {
  public schedule(processes: IProcess[]): number[] {
    const _processes = processes.map((process) => ({ ...process }))
    const schedule: number[] = []
    let currentMomentOfExecution = 0

    while (_processes.length > 0) {
      const arrivedProcesses = _processes.filter((p) => p.arrivalTime <= currentMomentOfExecution)

      if (arrivedProcesses.length === 0) {
        schedule.push(ChartBoxEnum.Empty)
        currentMomentOfExecution++
        continue
      }

      const shortestProcess = this.getShortestProcess(arrivedProcesses)
      schedule.push(...Array(shortestProcess.executionTime).fill(shortestProcess.id))
      currentMomentOfExecution += shortestProcess.executionTime

      const indexToRemove = _processes.indexOf(shortestProcess)
      _processes.splice(indexToRemove, 1)
    }

    return schedule
  }

  private getShortestProcess(processes: IProcess[]): IProcess {
    return processes.reduce((shortest, process) => {
      return shortest.executionTime < process.executionTime ? shortest : process
    })
  }
}
