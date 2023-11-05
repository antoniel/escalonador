import React, { useEffect, useState } from "react"
import FrontGanttChart from "./ChartSection/FrontGanttChart"
import MemoriesComponent from "./MemoryAbstraction/MemoriesComponent"
import "./App.css"
import { IProcess } from "../interfaces/Process"
import { IConditions } from "../interfaces/Conditions"
import { SchedulerFactory, SchedulerType } from "../schedulers"
import Scheduler from "../interfaces/Scheduler"
import CreateProcesses from "./ProcessCreationSection/CreateProcesses"
import clsx from "clsx"
import { atom, useAtom } from "jotai"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

const INITIAL_CONDITIONS: IConditions = {
  method: "FIFO",
  pagination: "fifo",
  quantum: 3,
  sobrecarga: 1,
  intervalo: 125,
}

const coditionsAtom = atom<IConditions>(INITIAL_CONDITIONS)
export default function App() {
  const [processes, setProcesses] = useState<{ [key: string]: IProcess }>({})
  const [conditions] = useAtom(coditionsAtom)
  const [schedule, setSchedule] = useState<number[]>([])
  const [save, setSave] = useState<boolean>(false)
  const [reset, setReset] = useState<boolean>(true)
  const [play, setPlay] = useState<boolean>(true)

  const processList = Object.values(processes)

  useEffect(() => {
    if (processList.length > 0) {
      const schedulerType: string = conditions.method
      const createdScheduler: Scheduler = SchedulerFactory.createScheduler(schedulerType as SchedulerType)
      const createdSchedule = createdScheduler.schedule(processList, conditions.quantum, conditions.sobrecarga)

      setSchedule(createdSchedule)
      console.log("CreatedSchedule", createdSchedule)
      setTimeout(() => {
        setPlay(!play)
      }, 500)
    }
  }, [save])

  function handleRun() {
    setReset(!reset)
    setSave(!save)
    ;(document.getElementById("button__run") as HTMLInputElement).disabled = true
  }
  function handleReset() {
    setReset(!reset)
    ;(document.getElementById("button__reset") as HTMLInputElement).disabled = true
    ;(document.getElementById("button__run") as HTMLInputElement).disabled = false
    ;(document.getElementById("chart__turnaround") as HTMLElement).style.color = "white"
    ;(document.getElementById("page__top") as HTMLElement).scrollIntoView()
    ;(document.getElementById("chart__warning") as HTMLElement).style.display = "none"
    ;(document.getElementsByClassName("memory-container")[0] as HTMLElement).style.visibility = "visible"
  }

  useEffect(() => {
    ;(document.getElementById("button__reset") as HTMLInputElement).disabled = true
    ;(document.getElementById("chart__warning") as HTMLElement).style.display = "none"
  }, [])

  console.log("processes", conditions.method)
  return (
    <div className="px-12 py-12">
      <div>
        <Methods />
        <Pagincação />
        <QuantumESobrecarga />
      </div>
      <CreateProcesses processes={processes} setProcesses={setProcesses} />
      <div className="flex justify-center space-x-4">
        <button className="p-10 rounded-lg bg-green-500" onClick={handleRun}>
          Run
        </button>
        <button className="p-10 rounded-lg bg-red-500" id="button__reset" onClick={handleReset}>
          Reset
        </button>
      </div>
      <FrontGanttChart
        processList={processList}
        conditions={conditions}
        schedule={schedule}
        play={play}
        reset={reset}
      />
      <MemoriesComponent
        processList={processList}
        conditions={conditions}
        schedule={schedule}
        play={play}
        reset={reset}
      />
    </div>
  )
}

const Methods = () => {
  const [conditions, setConditions] = useAtom(coditionsAtom)
  return (
    <div className="flex flex-col">
      <h2 className="methods__heading">Selecione o método:</h2>
      <Select onValueChange={(method: any) => setConditions({ ...conditions, method })}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Theme" />
        </SelectTrigger>
        <SelectContent>
          {(["EDF", "FIFO", "RR", "SJF"] as const).map((method) => (
            <SelectItem key={method} value={method}>
              {method}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="flex space-x-2"></div>
    </div>
  )
}

const QuantumESobrecarga = () => {
  const [conditions, setConditions] = useAtom(coditionsAtom)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setConditions({ ...conditions, [id]: value ? parseInt(value) : "" })
  }
  return (
    <div className="space-y-2">
      <label htmlFor="quantum" className="methods__bottom_field">
        <p>Quantum: </p>
        <input onChange={handleChange} type="number" id="quantum" name="quantum" min="1" value={conditions.quantum} />
      </label>
      <label htmlFor="overload" className="methods__bottom_field">
        <p>Sobrecarga: </p>
        <input onChange={handleChange} type="number" id="sobrecarga" min="0" value={conditions.sobrecarga} />
      </label>
    </div>
  )
}

const Pagincação = () => {
  const [conditions, setConditions] = useAtom(coditionsAtom)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setConditions({ ...conditions, [id]: value ? parseInt(value) : "" })
  }
  return (
    <div className="flex flex-col space-y-2">
      <h2 className="methods__pagination__title">Paginação: </h2>
      <div className="flex flex-row">
        <Select onValueChange={(pagination: "lru" | "fifo") => setConditions({ ...conditions, pagination })}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Paginação" />
          </SelectTrigger>
          <SelectContent>
            {(["fifo", "lru"] as const).map((pagination) => (
              <SelectItem key={pagination} value={pagination}>
                {pagination}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <input
          id="intervalo"
          type="range"
          min="125"
          max="2000"
          step="125"
          value={conditions.intervalo}
          onChange={handleChange}
        />
        {conditions.intervalo / 1000} segundos
      </div>
    </div>
  )
}
