import React, { useEffect, useState } from "react"
import { IProcess, PaginationData, PagingAlgorithm } from "@/types/types"
import { IConditions } from "@/types/types"
import FIFOPageReplacement from "../paging/fifo"
import LRUPageReplacement from "../paging/lru"
import { scheduleAtom } from "@/App"
import { useAtom } from "jotai"
import DiskMemory from "./Disk"
import MainMemory from "./Ram"

interface MemoriesComponentProps {
  processList: IProcess[]
  conditions: IConditions
  play: boolean
  reset: boolean
}

const ramSize = 200
const pageSize = 4
const diskSize = 400
const MemoriesComponent: React.FC<MemoriesComponentProps> = ({ conditions, processList, play, reset }) => {
  const [schedule] = useAtom(scheduleAtom)
  const [pagingData, setPagingData] = useState<PaginationData[]>([])

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
      <div className="flex flex-row flex-wrap justify-between items-start pb-14">
        <div className="flex-1 ">
          <DiskMemory pagingData={pagingData} intervalo={conditions.intervalo} play={play} reset={reset} />
        </div>
        <div className="flex-1">
          <MainMemory pagingData={pagingData} intervalo={conditions.intervalo} play={play} reset={reset} />
        </div>
      </div>
    </div>
  )
}

export default MemoriesComponent
