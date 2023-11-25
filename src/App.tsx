import React, { useState } from "react"
import MemoriesComponent from "./components/MemoryAbstraction/MemoriesComponent"
import { IProcess } from "./interfaces/types"
import { IConditions } from "./interfaces/types"
import { SchedulerMethods, getScheduler } from "./schedulers"
import { SchedulerType } from "./interfaces/types"
import CreateProcesses, { Process } from "./components/ProcessCreationSection/CreateProcesses"
import { atom, useAtom } from "jotai"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select"
import { Card, CardContent, CardHeader } from "./components/ui/card"
import { Input } from "./components/ui/input"
import { GanttChart } from "./gantt"
import { Button } from "./components/ui/button"
import { resetDiskMemoryAtom } from "./components/MemoryAbstraction/Disk"
import { resetMainMemoryAtom } from "./components/MemoryAbstraction/Ram"

const INITIAL_CONDITIONS: IConditions = {
  method: "FIFO",
  pagination: "fifo",
  quantum: 3,
  sobrecarga: 1,
  intervalo: 125,
}
const coditionsAtom = atom<IConditions>(INITIAL_CONDITIONS)
export const processesAtom = atom<{ [key: string]: IProcess }>({})
export const scheduleAtom = atom<SchedulerType>([])

export default function App() {
  const [processes, setProcesses] = useAtom(processesAtom)
  const [conditions] = useAtom(coditionsAtom)
  const setSchedule = useAtom(scheduleAtom)[1]

  const [reset, setReset] = useState<boolean>(true)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)

  const setResetDiskMemory = useAtom(resetDiskMemoryAtom)[1]
  const setResetMainMemory = useAtom(resetMainMemoryAtom)[1]
  const processList = Object.values(processes)

  const handlePlay = () => {
    const schedulerType = conditions.method as SchedulerMethods
    const schedule = getScheduler(schedulerType).schedule(processList, conditions.quantum, conditions.sobrecarga)

    setSchedule(schedule)
    setIsPlaying(!isPlaying)
  }
  const handleReset = () => {
    setResetDiskMemory()
    setResetMainMemory()
  }

  function handleRun() {
    handleReset()
    setReset(!reset)
    handlePlay()
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
          <Button onClick={handleRun}>{isPlaying ? "Reiniciar" : "Começar"}</Button>
          {Object.values(processes).map((process) => (
            <Process key={process.id} process={process} />
          ))}
        </CreateProcesses>
        {isPlaying && <GanttChart processList={processList} intervalo={conditions.intervalo} play={isPlaying} />}
      </section>
      <section>
        <h1>Visualização de Memória e Disco</h1>
        <MemoriesComponent processList={processList} conditions={conditions} play={isPlaying} reset={reset} />
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
