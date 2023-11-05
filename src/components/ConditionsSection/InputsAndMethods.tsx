import React from "react"
import { IConditions } from "../../interfaces/Conditions"
import "./InputsAndMethods.css"
import clsx from "clsx"

interface InputsAndMethodsProps {
  conditions: IConditions
  children?: React.ReactNode
  setConditions: React.Dispatch<React.SetStateAction<IConditions>>
}

const InputsAndMethods = ({ conditions, setConditions, children }: InputsAndMethodsProps) => {
  return (
    <div className="methods__form__wrapper">
      <div className="methods__form flex justify-center items-center" onSubmit={(e) => e.preventDefault()}>
        {children}
      </div>
    </div>
  )
}

export default InputsAndMethods
