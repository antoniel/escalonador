import ChartBoxEnum from "@/components/ChartSection/ChartBoxEnum"

export interface PaginationData {
  step: number
  executedProcess: number
  ram: number[]
  disk: number[]
}

export interface PagingAlgorithm {
  run(schedule: SchedulerType): PaginationData[]
}
export interface Scheduler {
  schedule(processes: IProcess[], quantum?: number, overheadTime?: number): SchedulerType
}

export interface IProcess {
  id?: any
  arrivalTime: number
  executionTime: number
  deadline?: number
  numPages: number
}

export interface Page {
  processId: number
  pageNumber: number
  location: "disk" | "ram"
}
export interface MemoryInterface {
  get storageLeft(): number
  get storage(): number[]
  store(processId: number, numPages: number): void
  release(processId: number, numPages: number): void
}
export interface IConditions {
  method: "FIFO" | "RR" | "SJF" | "EDF"
  pagination: "fifo" | "lru"
  quantum: number
  sobrecarga: number
  intervalo: number
}
export type SchedulerType = (number | ChartBoxEnum)[]
