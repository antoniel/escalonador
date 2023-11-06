import React, { useEffect } from "react"
import "./CreateProcesses.css"
// import { generateId } from "../../helper/generateId";
import { IProcess } from "../../interfaces/Process"
import { Card, CardContent, CardHeader } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { useAtom } from "jotai"
import { processesAtom } from "../App"

interface CreateProcessesProps {
  processes: {
    [key: string]: IProcess
  }
  setProcesses: React.Dispatch<
    React.SetStateAction<{
      [key: number]: IProcess
    }>
  >
  onDataChange?: (data: ProcessData[]) => void
  children?: React.ReactNode
}

interface ProcessData {
  processName: string
  executionTime: number
  deadline: number
  numPages: number
  arrivalTime: number
  processArray: IProcess
}

const INITIAL_PROCESS: IProcess = {
  arrivalTime: 0,
  deadline: 0,
  executionTime: 5,
  numPages: 5,
}

const CreateProcesses: React.FC<CreateProcessesProps> = ({ processes, setProcesses, children }) => {
  const createProcess = (process: IProcess) => {
    const id = Object.values(processes).length + 1
    const newProcesses = { ...processes, [id]: { ...process, id } }
    setProcesses(newProcesses)
  }

  useEffect(() => {
    if (Object.keys({ ...processes }).length == 0) {
      createProcess(INITIAL_PROCESS)
    }
  })

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-4 ">
      <button onClick={() => createProcess(INITIAL_PROCESS)} className="create__process__button">
        Criar processo
      </button>
      {children}
    </section>
  )
}

interface ProcessProps {
  process: IProcess
}

export const Process: React.FC<ProcessProps> = (props) => {
  const { process } = props
  const [processes, setProcesses] = useAtom(processesAtom)

  const updateProcess = (processId: string | undefined, key: keyof IProcess, value: number | undefined) => {
    if (!processId) return
    const updatedProcess = { ...processes[processId], [key]: value }
    const newProcesses = { ...processes, [processId]: updatedProcess }
    setProcesses(newProcesses)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    updateProcess(process.id, name as keyof IProcess, parseInt(value))
  }

  const deleteProcess = (processId: string | undefined) => {
    if (!processId) return
    const { [processId]: _, ...tmpProcesses } = processes
    const newProcesses = Object.values(tmpProcesses).reduce((acc, process, index) => {
      const id = index + 1
      return { ...acc, [id]: { ...process, id } }
    }, {})
    setProcesses(newProcesses)
  }

  const shouldShowDeleteOnlyIfMoreThanOneProcess = Object.keys(processes).length > 1
  return (
    <div className="process__card">
      <Card className="relative">
        {!!shouldShowDeleteOnlyIfMoreThanOneProcess && (
          <button onClick={() => deleteProcess(process.id)} className="text-lg absolute top-2 right-4">
            &#x00D7;
          </button>
        )}
        <CardHeader>
          <h2>
            Cód.: <code>{process.id}</code>
          </h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 grid-rows-2 gap-4">
            <div>
              <Label htmlFor="executionTime">Tempo:</Label>
              <Input
                onChange={handleChange}
                type="number"
                id={`executionTime-${process.id}`}
                name={"executionTime" as keyof IProcess}
                value={process.executionTime}
                min="1"
              />
            </div>
            <div>
              <Label htmlFor="deadline">Deadline:</Label>
              <Input
                onChange={handleChange}
                type="number"
                id={`deadline-${process.id}`}
                name={"deadline" as keyof IProcess}
                value={process.deadline}
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="numPages">Páginas:</Label>
              <Input
                onChange={handleChange}
                type="number"
                id={`numPages-${process.id}`}
                name={"numPages" as keyof IProcess}
                value={process.numPages}
                min="1"
              />
            </div>
            <div>
              <Label htmlFor="arrivalTime">Chegada:</Label>
              <Input
                onChange={handleChange}
                type="number"
                id={`arrivalTime-${process.id}`}
                name={"arrivalTime" as keyof IProcess}
                value={process.arrivalTime}
                min="0"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default CreateProcesses
