import PaginationData from "./PaginationData"
import { SchedulerType } from "./Scheduler"

export default interface PagingAlgorithm {
  run(schedule: SchedulerType): PaginationData[]
}
