/* eslint-disable @typescript-eslint/no-unused-vars */
import { IProcess, MemoryInterface, PaginationData, PagingAlgorithm, SchedulerType } from "@/types/types"
import Memory from "../data/Memory"
export default abstract class AbsPaging implements PagingAlgorithm {
  protected ram: MemoryInterface
  protected disk: MemoryInterface
  protected pageTable: Map<number, number>
  protected pageNumMap: Map<number, number>

  constructor(processes: IProcess[], ramSize: number, pageSize: number, diskSize: number) {
    this.ram = new Memory(ramSize, pageSize)
    this.disk = new Memory(diskSize, pageSize)
    this.pageTable = new Map<number, number>()
    this.pageNumMap = new Map<number, number>()

    // Initially:
    //    load all processes pages on disk
    //    store the total number of pages of each process.
    //    intialize the page table
    let process: IProcess
    for (let i = 0; i < processes.length; i++) {
      process = processes[i]
      this.disk.store(process.id, process.numPages)
      this.pageNumMap.set(process.id, process.numPages)
      this.pageTable.set(process.id, 0)
    }
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  schedule(processes: IProcess[], quantum?: number, overheadTime?: number): SchedulerType {
    throw new Error("Method not implemented.")
  }

  protected abstract loadProcessPages(processId: number): void

  protected ramToDisk(processId: number, numPages: number): void {
    this.ram.release(processId, numPages)
    this.disk.store(processId, numPages)

    const previousNumPages = this.pageTable.get(processId) as number
    this.pageTable.set(processId, previousNumPages - numPages)
  }

  protected diskToRam(processId: number, numPages: number): void {
    this.disk.release(processId, numPages)
    this.ram.store(processId, numPages)

    const previousNumPages = this.pageTable.get(processId) as number
    this.pageTable.set(processId, previousNumPages + numPages)
  }

  public run(schedule: number[]): PaginationData[] {
    const pagingData: PaginationData[] = []
    let currProcess: number

    for (let i = 0; i < schedule.length; i++) {
      currProcess = schedule[i]

      if (currProcess !== -1) this.loadProcessPages(schedule[i])

      pagingData.push({
        step: i,
        executedProcess: currProcess,
        ram: [...this.ram.storage],
        disk: [...this.disk.storage],
      })
    }

    return pagingData
  }
}
