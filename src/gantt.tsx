import { IProcess } from "./interfaces/Process"
import ChartBoxEnum from "./components/ChartSection/ChartBoxEnum"
import React, { useState } from "react"
import { useAtom } from "jotai"
import { scheduleAtom } from "./App"

interface GanttP {
  processList: IProcess[]
  intervalo: number
  play: boolean
}

export const GanttChart = ({ intervalo, processList, play }: GanttP) => {
  const [schedule] = useAtom(scheduleAtom)
  const [currentTime, setCurrentTime] = useState(0)

  React.useEffect(() => {
    let interval: NodeJS.Timeout
    if (play) {
      interval = setInterval(() => {
        setCurrentTime((currentTime) => currentTime + 1)
      }, intervalo)
    } else {
      setCurrentTime(0)
    }
    return () => clearInterval(interval)
  }, [intervalo, play])

  const getStatusClass = (processId, time, lastProcess) => {
    const process = processList.find((p) => p.id === processId)
    const lastIndexOfProcess = schedule.lastIndexOf(processId)

    if (time > currentTime) {
      return "bg-white" // Empty
    }

    const isProcessing = schedule[time] === processId
    const isSwitching =
      (schedule[time] === ChartBoxEnum.OverHead || schedule[time] === ChartBoxEnum.Switch) && processId === lastProcess
    const isWaiting = time < process.arrivalTime || time > lastIndexOfProcess

    if (isProcessing) {
      return "bg-green-500" // Processing
    }

    if (isSwitching) {
      return "bg-blue-500" // Switching
    }

    if (isWaiting) {
      return "bg-yellow-200" // Waiting
    }

    return "bg-white" // Empty
  }

  return (
    <div className="flex flex-col  items-center">
      {processList.map((process) => (
        <div key={process.id} className="flex">
          {schedule.map((_, time) => {
            // Removed the slice to render all squares
            const lastProcess = getPreviousProcess(schedule, time)
            return (
              <div
                key={time}
                className={`w-6 h-6 border-slate-700 border-[0.1px] ${getStatusClass(process.id, time, lastProcess)}`}
              />
            )
          })}
        </div>
      ))}
    </div>
  )
}

const getPreviousProcess = (schedule, time) => {
  if (time < 0) {
    return 0
  }
  const lastProcess = schedule[time - 1]
  return lastProcess > 0 ? lastProcess : getPreviousProcess(schedule, time - 1)
}
