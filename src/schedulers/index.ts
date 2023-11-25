import FIFOScheduler from "./fifo"
import EDFScheduler from "./edf"
import SJFScheduler from "./sjf"
import RoundRobinScheduler from "./roundRobin"
import { match } from "ts-pattern"
import { IConditions, Scheduler } from "@/types/types"

export type SchedulerMethods = IConditions["method"]
export const getScheduler = (type: IConditions["method"]): Scheduler => {
  return match(type)
    .with("FIFO", () => new FIFOScheduler())
    .with("SJF", () => new SJFScheduler())
    .with("RR", () => new RoundRobinScheduler())
    .with("EDF", () => new EDFScheduler())
    .exhaustive()
}
