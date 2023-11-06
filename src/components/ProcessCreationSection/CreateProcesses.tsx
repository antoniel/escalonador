import React, { useEffect } from "react"
import "./CreateProcesses.css"
// import { generateId } from "../../helper/generateId";
import { IProcess } from "../../interfaces/Process"
import Process from "./Process"

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

const CreateProcesses: React.FC<CreateProcessesProps> = ({ processes, setProcesses }) => {
  const createProcess = (process: IProcess) => {
    const id = Object.values(processes).length + 1
    const newProcesses = { ...processes, [id]: { ...process, id } }
    setProcesses(newProcesses)
  }

  const updateProcess = (processId: string | undefined, key: keyof IProcess, value: number | undefined) => {
    if (!processId) return
    const updatedProcess = { ...processes[processId], [key]: value }
    const newProcesses = { ...processes, [processId]: updatedProcess }
    setProcesses(newProcesses)
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

  useEffect(() => {
    if (Object.keys({ ...processes }).length == 0) {
      createProcess(INITIAL_PROCESS)
    }
  })

  return (
    <section className="">
      <ol className="process__list">
        <li>
          <button onClick={() => createProcess(INITIAL_PROCESS)} className="create__process__button">
            Criar processo
          </button>
        </li>
        {Object.values(processes).map((process) => (
          <li key={process.id}>
            <Process process={process} updateProcess={updateProcess} deleteProcess={deleteProcess} />
          </li>
        ))}
      </ol>
      <div className="create__process__heading"></div>
    </section>
  )
}

export default CreateProcesses
