import { IProcess, Scheduler } from "@/interfaces/types"
import RotatingQueue from "../data/RotatingQueue"
import ChartBoxEnum from "../interfaces/ChartBoxEnum"

export default class RoundRobinScheduler implements Scheduler {
  public schedule(processes: IProcess[], quantum = 2, overheadTime = 1): number[] {
    const _processes: IProcess[] = [...processes].map((obj) => Object.assign({}, obj))
    const schedule: number[] = []
    let currentProcess: IProcess
    let currentMomentOfExecution = 0
    let processIterations = 0
    let processIndex = -1
    let lastProcessEnded = true

    const queue: RotatingQueue = new RotatingQueue()

    while (_processes.length !== 0) {
      const arrivedProcesses = _processes
        .filter((process) => process.arrivalTime <= currentMomentOfExecution)
        .map((process) => process.id)

      if (arrivedProcesses.length === 0) {
        schedule[currentMomentOfExecution] = ChartBoxEnum.Empty
        currentMomentOfExecution++
        continue
      }

      queue.addElements(arrivedProcesses)

      if (lastProcessEnded === false) {
        queue.rotate()
      }

      processIndex = this.getProcessIndex(queue.get(), _processes)
      currentProcess = _processes[processIndex]

      // quantum time execution
      processIterations = Math.min(currentProcess?.executionTime, quantum)
      for (let i = 0; i < processIterations; i++) {
        schedule[currentMomentOfExecution] = currentProcess.id
        currentProcess.executionTime -= 1
        currentMomentOfExecution++
      }

      if (currentProcess.executionTime !== 0) {
        //overhead
        for (let i = 0; i < overheadTime; i++) {
          schedule[currentMomentOfExecution] = -1
          currentMomentOfExecution++
        }

        lastProcessEnded = false
      } else {
        _processes.splice(processIndex, 1)
        queue.remove(currentProcess.id)
        lastProcessEnded = true
      }
    }

    return schedule
  }

  private getProcessIndex(processId: number, processes: IProcess[]) {
    for (let i = 0; i < processes.length; i++) {
      if (processes[i].id == processId) {
        return i
      }
    }

    return -1
  }
}
