import clsx from "clsx"
import type { HTMLAttributes } from "react"

type Props = HTMLAttributes<HTMLDivElement> & {
    value: number
    max: number
}

export default function ProgressBar({ value, max, className, ...props }: Props) {
    const percentage = Math.round(100 * value / max)
    return (
        <div className={clsx(className, "bg-amber-50 rounded-lg text-amber-800 flex flex-row gap-3 items-center")} {...props}>
            <div className="bg-amber-400 h-10 rounded-lg text-white flex items-center justify-end" style={{ width: percentage + "%" }}>
                { percentage > 15 && <span className="me-3">{value} / {max}</span>}
            </div>
            { percentage <= 15 && <span>{value} / {max}</span>}
        </div>
    )
}