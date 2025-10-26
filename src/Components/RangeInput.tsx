import { useId, type InputHTMLAttributes } from "react"
import clsx from "clsx"
import { formatLargeNumber } from "../shared/formatLargeNumber"

type Props = InputHTMLAttributes<HTMLInputElement> & {
  value: string
  label: string
  valueClassName?: string
}

export default function RangeInput({ valueClassName, label, value, className, style, ...props }: Props) {
  const id = useId()

  return (
    <div className={className} style={style}>
      <label htmlFor={id}>{label}</label>
      <div className="flex flex-row gap-2 items-center">
        <p className={clsx("text-amber-800 font-bold", valueClassName)}>
          {formatLargeNumber(parseInt(value))}
        </p>
        <input
          type="range"
          className="flex-1 accent-amber-800"
          id={id}
          value={value}
          {...props}
        />
      </div>
    </div>
  )
}