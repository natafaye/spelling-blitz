import clsx from "clsx"
import type { ButtonHTMLAttributes } from "react"

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "default" | "danger"
}
export default function Button({ variant = "default", className, children, ...props }: Props) {
    return (
        <button
            className={clsx(
                className, 
                "bg-amber-700 text-white p-3 rounded-lg", 
                "hover:bg-yellow-600 hover:scale-105"
            )}
            {...props}
        >
            {children}
        </button>
    )
}