import { useEffect } from "react"
// import "./MainMemory.css"
import { PaginationData } from "@/types/types"
import { atom, useAtom } from "jotai"

interface MainMemoryProps {
  pagingData: PaginationData[]
  intervalo: number
  play: boolean
  reset: boolean
}

const DEFAULT_MATRIX = Array.from({ length: 10 }, () => Array(12).fill("⚪️"))
const DiskAtom = atom({
  matrix: DEFAULT_MATRIX,
  currentStep: 1,
})
export const resetMainMemoryAtom = atom(null, (_get, set) => {
  set(DiskAtom, {
    matrix: Array.from({ length: 5 }, () => Array(10).fill("⚪️")),
    currentStep: 1,
  })
})
const MainMemory: React.FC<MainMemoryProps> = ({ pagingData, intervalo, play, reset }) => {
  const [disk, setDisk] = useAtom(DiskAtom)
  const matrix = disk.matrix
  const currentStep = disk.currentStep

  useEffect(() => {
    if (!reset) {
      const interval = setInterval(() => {
        if (currentStep < pagingData.length) {
          const currentRam = pagingData[currentStep].ram
          const newMatrix = matrix.map((row) => [...row])

          for (let i = 0; i < currentRam.length; i++) {
            const value = currentRam[i]
            const rowIndex = Math.floor(i / 10)
            const colIndex = i % 10
            const address = rowIndex * 10 + colIndex
            newMatrix[rowIndex][colIndex] = { value, address }
            if (isNaN(value)) {
              newMatrix[rowIndex][colIndex] = "⚪️"
            }
          }

          for (let i = currentRam.length; i < 50; i++) {
            const rowIndex = Math.floor(i / 10)
            const colIndex = i % 10
            newMatrix[rowIndex][colIndex] = "⚪️"
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
  }, [currentStep, matrix, play])

  return (
    <div className="flex justify-center items-center flex-col w-full mt-4">
      <h1>RAM</h1>
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

export default MainMemory
