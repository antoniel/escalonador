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
import { Card, CardContent, CardHeader } from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"

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

  return (
    <div className="px-12 py-12 max-w-screen-xl mx-auto ">
      <section>
        <h1>Configurações de Escalonamento</h1>
        <div className="flex gap-4">
          <Methods />
          <Pagincação />
          <Intervalo />
          <Quantum />
          <Sobrecarga />
        </div>
      </section>
      <section className="mt-8">
        <h1>Gerenciamento de Processos</h1>
        <CreateProcesses processes={processes} setProcesses={setProcesses} />
      </section>
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
    <Card>
      <CardHeader>
        <h2>Selecione o método</h2>
      </CardHeader>
      <CardContent>
        <Select onValueChange={(method: any) => setConditions({ ...conditions, method })}>
          <SelectTrigger>
            <SelectValue placeholder="EDF" defaultValue={"EDF"} />
          </SelectTrigger>
          <SelectContent>
            {(["EDF", "FIFO", "RR", "SJF"] as const).map((method) => (
              <SelectItem key={method} value={method}>
                {method}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  )
}

const Pagincação = () => {
  const [conditions, setConditions] = useAtom(coditionsAtom)
  return (
    <Card>
      <CardHeader>
        <h2>Paginação </h2>
      </CardHeader>
      <CardContent>
        <Select onValueChange={(pagination: "lru" | "fifo") => setConditions({ ...conditions, pagination })}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="fifo" defaultValue={"fifo"} />
          </SelectTrigger>
          <SelectContent>
            {(["fifo", "lru"] as const).map((pagination) => (
              <SelectItem key={pagination} value={pagination}>
                {pagination}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  )
}

const Intervalo = () => {
  const [conditions, setConditions] = useAtom(coditionsAtom)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    const intervaloEmSegundos = Math.abs((parseFloat(value) || 1) * 1000)
    setConditions({ ...conditions, [id]: value ? intervaloEmSegundos : "" })
  }

  return (
    <Card>
      <CardHeader>
        <div>
          <h2 className="inline">Intervalo </h2>
          <p className="inline">(segundos)</p>
        </div>
      </CardHeader>
      <CardContent className="flex justify-center items-center gap-2">
        <Input
          id="intervalo"
          type="number"
          pattern="[0-9]*"
          inputMode="numeric"
          defaultValue={0.125}
          max={10}
          min={1}
          onChange={handleChange}
        />
      </CardContent>
    </Card>
  )
}

const Quantum = () => {
  const [conditions, setConditions] = useAtom(coditionsAtom)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setConditions({ ...conditions, [id]: value ? parseInt(value) : "" })
  }
  return (
    <div className="space-y-2">
      <Card>
        <CardHeader>
          <h2>Quantum </h2>
        </CardHeader>
        <CardContent>
          <Input onChange={handleChange} type="number" id="quantum" name="quantum" min="1" value={conditions.quantum} />
        </CardContent>
      </Card>
    </div>
  )
}

const Sobrecarga = () => {
  const [conditions, setConditions] = useAtom(coditionsAtom)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setConditions({ ...conditions, [id]: value ? parseInt(value) : "" })
  }

  return (
    <Card>
      <CardHeader>
        <h2>Sobrecarga</h2>
      </CardHeader>
      <CardContent>
        <Input id="sobrecarga" type="number" min="0" value={conditions.sobrecarga} onChange={handleChange} />
      </CardContent>
    </Card>
  )
}
