import React, { useEffect, useState } from "react"
import MainMemory from "./RAM/MainMemory"
import DiskMemory from "./Disk/Disk"
import "./MemoriesStyle.css"
import { IProcess } from "../../interfaces/Process"
import { IConditions } from "../../interfaces/Conditions"
import PagingAlgorithm from "../../interfaces/PagingAlgorithm"
import PaginationData from "../../interfaces/PaginationData"
import FIFOPageReplacement from "../../paging/fifo"
import LRUPageReplacement from "../../paging/lru"
import { SchedulerType } from "@/interfaces/Scheduler"

interface MemoriesComponentProps {
  processList: IProcess[]
  conditions: IConditions
  schedule: SchedulerType
  play: boolean
  reset: boolean
}

const MemoriesComponent: React.FC<MemoriesComponentProps> = ({ conditions, processList, schedule, play, reset }) => {
  const [pagingData, setPagingData] = useState<PaginationData[]>([])

  const ramSize = 200
  const pageSize = 4
  const diskSize = 480

  useEffect(() => {
    if (conditions.pagination == "fifo") {
      const fifoPaging: PagingAlgorithm = new FIFOPageReplacement(processList, ramSize, pageSize, diskSize)
      setPagingData(fifoPaging.run(schedule))
    } else {
      const lruPaging: PagingAlgorithm = new LRUPageReplacement(processList, ramSize, pageSize, diskSize)
      setPagingData(lruPaging.run(schedule))
    }
  }, [schedule])

  return (
    <div className="">
      <div className="memory-container">
        <div className="disk-container">
          <DiskMemory pagingData={pagingData} intervalo={conditions.intervalo} play={play} reset={reset} />
        </div>
        <div className="ram-container">
          <MainMemory pagingData={pagingData} intervalo={conditions.intervalo} play={play} reset={reset} />
        </div>
      </div>
    </div>
  )
}

export default MemoriesComponent
