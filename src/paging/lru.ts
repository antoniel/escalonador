import { IProcess } from "@/interfaces/types"
import LRUQueue from "../data/LRUQueue"
import AbsPaging from "./AbsPaging"

export default class LRUPageReplacement extends AbsPaging {
  private LRUQueue: LRUQueue

  constructor(processes: IProcess[], ramSize: number, pageSize: number, diskSize: number) {
    super(processes, ramSize, pageSize, diskSize)
    this.LRUQueue = new LRUQueue()
  }

  loadProcessPages(processId: number): void {
    this.LRUQueue.updateProcess(processId) // update the process position in the LRU queue
    const numDiskPages: number = (this.pageNumMap.get(processId) as number) - (this.pageTable.get(processId) as number)
    if (numDiskPages === 0) return

    if (numDiskPages > this.ram.storageLeft) {
      let allocatedStorage: number = this.ram.storageLeft
      while (allocatedStorage < numDiskPages) {
        const LRUProcess: number = this.LRUQueue.lru
        const LRUProcessRamPages: number = this.pageTable.get(LRUProcess) as number
        const newAllocatedStorage: number = LRUProcessRamPages + allocatedStorage

        if (newAllocatedStorage <= numDiskPages) {
          allocatedStorage = newAllocatedStorage
          this.LRUQueue.shift()
          this.ramToDisk(LRUProcess, LRUProcessRamPages)
        } else {
          const necessaryPages = numDiskPages - allocatedStorage
          allocatedStorage += necessaryPages
          this.ramToDisk(LRUProcess, necessaryPages)
        }
      }
    }

    this.diskToRam(processId, numDiskPages)
  }
}
