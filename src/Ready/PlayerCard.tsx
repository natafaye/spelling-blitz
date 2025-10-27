import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import type { Player } from "../shared/types"
import { faSquareCheck, faSquareXmark } from "@fortawesome/free-solid-svg-icons"
import clsx from "clsx"

type Props = {
    player: Player
    isSelf: boolean
    className?: string
}

export default function PlayerCard({ player: { color, name, ready }, isSelf, className }: Props) {
    return (
        <div className={clsx(className,
            "flex items-center p-2 gap-2 rounded",
            ready && "bg-emerald-100"
        )}>
            <div className="w-5 h-5 rounded" style={{ backgroundColor: color }}></div>
            <div className={clsx(
                "flex-1 overflow-hidden flex flex-row relative",
                isSelf && "font-bold"
            )}>
                {name}
                <div className={clsx(
                    "bg-linear-to-l to-transparent w-4 absolute end-0 h-full",
                    ready ? "from-emerald-100" : "from-white"
                )}></div>
            </div>
            <FontAwesomeIcon
                icon={ready ? faSquareCheck : faSquareXmark}
                className={clsx(
                    "ms-auto",
                    ready ? "text-emerald-500" : "text-rose-600"
                )}
                size="lg"
            />
        </div>
    )
}