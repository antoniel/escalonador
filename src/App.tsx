import React, { useEffect, useState } from "react"
import MemoriesComponent from "./components/MemoryAbstraction/MemoriesComponent"
import "./components/App.css"
import { IProcess } from "./interfaces/Process"
import { IConditions } from "./interfaces/Conditions"
import { SchedulerMethods, getScheduler } from "./schedulers"
import Scheduler, { SchedulerType } from "./interfaces/Scheduler"
import CreateProcesses, { Process } from "./components/ProcessCreationSection/CreateProcesses"
import { atom, useAtom } from "jotai"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select"
import { Card, CardContent, CardHeader } from "./components/ui/card"
import { Input } from "./components/ui/input"
import { GanttChart } from "./gantt"
import { Button } from "./components/ui/button"

const INITIAL_CONDITIONS: IConditions = {
  method: "FIFO",
  pagination: "fifo",
  quantum: 3,
  sobrecarga: 1,
  intervalo: 125,
}
const coditionsAtom = atom<IConditions>(INITIAL_CONDITIONS)
export const processesAtom = atom<{ [key: string]: IProcess }>({})

export default function App() {
  const [processes, setProcesses] = useAtom(processesAtom)
  const [conditions] = useAtom(coditionsAtom)
  const [schedule, setSchedule] = useState<SchedulerType>([])
  const [save, setSave] = useState<boolean>(false)
  const [reset, setReset] = useState<boolean>(true)
  const [play, setPlay] = useState<boolean>(false)

  const processList = Object.values(processes)

  useEffect(() => {
    if (processList.length > 0) {
      const schedulerType = conditions.method as SchedulerMethods
      const schedule = getScheduler(schedulerType).schedule(processList, conditions.quantum, conditions.sobrecarga)

      setSchedule(schedule)
      console.log("CreatedSchedule", schedule)
      setTimeout(() => {
        setPlay(!play)
      }, 500)
    }
  }, [save])

  function handleRun() {
    setReset(!reset)
    setSave(!save)
  }

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
      <section className="mt-8 space-y-4">
        <div>
          <h1>Gerenciamento de Processos</h1>
        </div>
        <CreateProcesses processes={processes} setProcesses={setProcesses}>
          <Button onClick={handleRun}>{play ? "Reiniciar" : "Começar"}</Button>
          {Object.values(processes).map((process) => (
            <Process key={process.id} process={process} />
          ))}
        </CreateProcesses>
        <GanttChart
          processList={processList}
          intervalo={conditions.intervalo}
          schedule={schedule}
          play={play}
          reset={reset}
        />
      </section>
      <section>
        <h1>Visualização de Memória e Disco</h1>
        <MemoriesComponent
          processList={processList}
          conditions={conditions}
          schedule={schedule}
          play={play}
          reset={reset}
        />
      </section>
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
    <Card>
      <CardHeader>
        <h2>Quantum </h2>
      </CardHeader>
      <CardContent>
        <Input onChange={handleChange} type="number" id="quantum" name="quantum" min="1" value={conditions.quantum} />
      </CardContent>
    </Card>
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
