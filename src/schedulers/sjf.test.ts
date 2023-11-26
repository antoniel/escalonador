import ChartBoxEnum from "../types/ChartBoxEnum"
import SJFScheduler from "./sjf"

describe("SJFScheduler", () => {
  it("should schedule processes in shortest job first order", () => {
    const scheduler = new SJFScheduler()
    const processes: any[] = [
      { id: 1, arrivalTime: 0, executionTime: 3 },
      { id: 2, arrivalTime: 0, executionTime: 1 },
      { id: 3, arrivalTime: 0, executionTime: 2 },
    ]

    const result = scheduler.schedule(processes)
    expect(result).toEqual([2, 3, 3, 1, 1, 1])
  })

  it("should handle processes arriving at different times", () => {
    const scheduler = new SJFScheduler()
    const processes: any[] = [
      { id: 1, arrivalTime: 0, executionTime: 2 },
      { id: 2, arrivalTime: 1, executionTime: 1 },
    ]

    const result = scheduler.schedule(processes)
    expect(result).toEqual([1, 1, 2])
  })

  it("should insert empty slots when no process has arrived", () => {
    const scheduler = new SJFScheduler()
    const processes: any[] = [{ id: 1, arrivalTime: 2, executionTime: 2 }]

    const result = scheduler.schedule(processes)
    expect(result).toEqual([ChartBoxEnum.Empty, ChartBoxEnum.Empty, 1, 1])
  })

  // Adicione mais testes conforme necessário
})
