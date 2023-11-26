import ChartBoxEnum from "@/types/ChartBoxEnum"
import { IProcess } from "@/types/types"
import FIFOScheduler from "./fifo"

describe("FIFOScheduler", () => {
  it("should schedule processes in FIFO order", () => {
    const scheduler = new FIFOScheduler()
    const processes: any[] = [
      { id: 1, arrivalTime: 0, executionTime: 2 },
      { id: 2, arrivalTime: 1, executionTime: 1 },
    ]

    const result = scheduler.schedule(processes)
    expect(result).toEqual([1, 1, 2])
  })

  it("should handle processes with delayed arrival times", () => {
    const scheduler = new FIFOScheduler()
    const processes: any[] = [
      { id: 1, arrivalTime: 2, executionTime: 1 },
      { id: 2, arrivalTime: 0, executionTime: 1 },
    ]

    const result = scheduler.schedule(processes)
    expect(result).toEqual([2, ChartBoxEnum.Empty, 1])
  })

  it("should insert empty slots when no process is running", () => {
    const scheduler = new FIFOScheduler()
    const processes: any[] = [{ id: 1, arrivalTime: 3, executionTime: 1 }]

    const result = scheduler.schedule(processes)
    expect(result).toEqual([ChartBoxEnum.Empty, ChartBoxEnum.Empty, ChartBoxEnum.Empty, 1])
  })
})
