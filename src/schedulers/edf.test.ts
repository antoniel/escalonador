import ChartBoxEnum from "@/types/ChartBoxEnum"
import EDFScheduler from "./edf"

describe("EDFScheduler", () => {
  it("should schedule processes based on earliest deadline", () => {
    const scheduler = new EDFScheduler()
    const processes = [
      { id: 1, arrivalTime: 0, executionTime: 3, deadline: 10 },
      { id: 2, arrivalTime: 1, executionTime: 2, deadline: 8 },
    ]

    const result = scheduler.schedule(processes as any)
    expect(result).toEqual([1, 1, ChartBoxEnum.OverHead, 2, 2, 1])
  })

  it("should handle empty process list", () => {
    const scheduler = new EDFScheduler()
    const result = scheduler.schedule([])
    expect(result).toEqual([])
  })

  it("should insert empty slots when no process has arrived", () => {
    const scheduler = new EDFScheduler()
    const processes = [{ id: 1, arrivalTime: 2, executionTime: 1, deadline: 5 }]

    const result = scheduler.schedule(processes as any)
    expect(result).toEqual([ChartBoxEnum.Empty, ChartBoxEnum.Empty, 1])
  })

  // Adicione mais testes conforme necessário
})
