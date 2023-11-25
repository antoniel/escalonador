import ChartBoxEnum from "@/components/ChartSection/ChartBoxEnum"
import { IProcess } from "./Process"

export default interface Scheduler {
  schedule(processes: IProcess[], quantum?: number, overheadTime?: number): SchedulerType
}
export type SchedulerType = (number | ChartBoxEnum)[]
