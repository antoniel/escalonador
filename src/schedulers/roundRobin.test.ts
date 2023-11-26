import ChartBoxEnum from "../types/ChartBoxEnum"
import RoundRobinScheduler from "./roundRobin"

describe("RoundRobinScheduler", () => {
  it("should schedule processes in round-robin order with given quantum", () => {
    const scheduler = new RoundRobinScheduler()
    const processes: any[] = [
      { id: 1, arrivalTime: 0, executionTime: 4 },
      { id: 2, arrivalTime: 0, executionTime: 2 },
    ]

    const result = scheduler.schedule(processes, 2, 1)
    expect(result).toEqual([1, 1, ChartBoxEnum.Switch, 2, 2, 1, 1])
  })

  it("should handle processes arriving at different times", () => {
    const scheduler = new RoundRobinScheduler()
    const processes: any[] = [
      { id: 1, arrivalTime: 0, executionTime: 2 },
      { id: 2, arrivalTime: 1, executionTime: 2 },
    ]

    const result = scheduler.schedule(processes, 1, 1)
    expect(result).toEqual([1, ChartBoxEnum.Switch, 2, ChartBoxEnum.Switch, 1, 2])
  })

  it("should insert empty slots when no process is running", () => {
    const scheduler = new RoundRobinScheduler()
    const processes: any[] = [{ id: 1, arrivalTime: 2, executionTime: 2 }]

    const result = scheduler.schedule(processes, 1, 1)
    expect(result).toEqual([ChartBoxEnum.Empty, ChartBoxEnum.Empty, 1, ChartBoxEnum.Switch, 1])
  })
})
