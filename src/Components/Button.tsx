import clsx from "clsx"
import type { ButtonHTMLAttributes } from "react"

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "default" | "danger" | "success"
}
export default function Button({ variant = "default", className, children, ...props }: Props) {
    return (
        <button
            className={clsx(
                className, 
                "text-white p-3 rounded-lg", 
                variant === "default" && "bg-amber-700 hover:bg-yellow-600",
                variant === "danger" && "bg-neutral-600 hover:bg-neutral-500",
                variant === "success" && "bg-emerald-700 hover:bg-emerald-600",
                "disabled:bg-neutral-500"
            )}
            {...props}
        >
            {children}
        </button>
    )
}