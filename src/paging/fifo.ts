import AbsPaging from "./AbsPaging"
import { IProcess } from "@/types/types"

export default class FIFOPageReplacement extends AbsPaging {
  private firstInQueue: number[] = []

  constructor(processes: IProcess[], ramSize: number, pageSize: number, diskSize: number) {
    super(processes, ramSize, pageSize, diskSize)
  }

  loadProcessPages(processId: number): void {
    const numDiskPages: number = (this.pageNumMap.get(processId) as number) - (this.pageTable.get(processId) as number)
    if (numDiskPages === 0) return

    if (numDiskPages > this.ram.storageLeft) {
      let allocatedStorage: number = this.ram.storageLeft
      while (allocatedStorage < numDiskPages) {
        const firstInProcess: number = this.firstInQueue[0]
        const firstInProcessRamPages: number = this.pageTable.get(firstInProcess) as number
        const newAllocatedStorage: number = firstInProcessRamPages + allocatedStorage

        if (newAllocatedStorage <= numDiskPages) {
          allocatedStorage = newAllocatedStorage
          this.firstInQueue.shift()
          this.ramToDisk(firstInProcess, firstInProcessRamPages)
        } else {
          const necessaryPages = numDiskPages - allocatedStorage
          allocatedStorage += necessaryPages
          this.ramToDisk(firstInProcess, necessaryPages)
        }
      }
    }

    this.diskToRam(processId, numDiskPages)
    this.firstInQueue.push(processId)
  }
}
