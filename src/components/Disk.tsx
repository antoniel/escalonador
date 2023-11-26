import { useEffect } from "react"
import { PaginationData } from "@/types/types"
import { atom, useAtom } from "jotai"

interface DiskProps {
  pagingData: PaginationData[]
  intervalo: number
  play: boolean
  reset: boolean
}

const EmptyCellSymbol = "⚪️"
const DEFAULT_MATRIX = Array.from({ length: 10 }, () => Array(12).fill("⚪️"))
const DiskAtom = atom({
  matrix: DEFAULT_MATRIX,
  currentStep: 1,
})
export const resetDiskMemoryAtom = atom(null, (_get, set) => {
  set(DiskAtom, {
    matrix: DEFAULT_MATRIX,
    currentStep: 1,
  })
})

const DiskMemory: React.FC<DiskProps> = ({ pagingData, intervalo, play, reset }) => {
  const [disk, setDisk] = useAtom(DiskAtom)

  const matrix = disk.matrix
  const currentStep = disk.currentStep

  useEffect(() => {
    if (!reset) {
      const interval = setInterval(() => {
        if (currentStep < pagingData.length) {
          const currentDisco = pagingData[currentStep].disk
          const newMatrix = matrix.map((row) => [...row])

          for (let i = 0; i < currentDisco.length; i++) {
            const value = currentDisco[i]
            const colIndex = i % 12
            const rowIndex = Math.floor(i / 12)
            const address = rowIndex * 12 + colIndex
            newMatrix[rowIndex][colIndex] = { value, address }
            if (isNaN(value)) {
              newMatrix[rowIndex][colIndex] = EmptyCellSymbol
            }
          }

          for (let i = currentDisco.length; i < 120; i++) {
            const colIndex = i % 12
            const rowIndex = Math.floor(i / 12)
            newMatrix[rowIndex][colIndex] = EmptyCellSymbol
          }

          setDisk((prevDisk) => ({ ...prevDisk, matrix: newMatrix, currentStep: prevDisk.currentStep + 1 }))
        } else {
          clearInterval(interval)
        }
      }, intervalo)

      return () => {
        clearInterval(interval)
      }
    }
  }, [currentStep, intervalo, matrix, pagingData, play, reset, setDisk])

  return (
    <div className="flex justify-center items-center flex-col w-full mt-4">
      <h1>Disco</h1>
      {matrix.map((row: (number | string | { value: number | string; address: number })[], rowIndex: number) => (
        <div key={rowIndex} className="flex bg-white">
          {row.map((cell: number | string | { value: number | string; address: number }, cellIndex: number) => (
            <div
              key={cellIndex}
              className="relative border w-[35px] h-[35px] flex justify-center items-center p-2 border-solid border-black"
            >
              {typeof cell === "object" ? (
                <div>
                  <div className="absolute text-xs text-[blue]  right-0 top-0">{cell.address}</div>
                  <div className="mt-4">{cell.value}</div>
                </div>
              ) : (
                cell
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export default DiskMemory
