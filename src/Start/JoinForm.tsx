import { useState, type ChangeEvent, type MouseEvent } from "react"
import Button from "../Components/Button"
import { existsGameWithId } from "./existsGameWithId"

type Props = {
    onJoin: (id: string) => void
}

export default function JoinForm({ onJoin }: Props) {
    const [loading, setLoading] = useState(false)
    const [idValue, setIdValue] = useState("")
    const [error, setError] = useState<null | string>(null)

    const onJoinChange = (event: ChangeEvent<HTMLInputElement>) => {
        setIdValue(event.target.value.toLowerCase())
        setError(null)
    }

    const joinGame = async (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        if(idValue === "") return
        
        setLoading(true)
        if (await existsGameWithId(idValue)) {
            onJoin(idValue)
        } else {
            setError("There isn't a game with that id")
        }
        setLoading(false)
    }

    return (
        <div>
            <form className="flex">
                <input
                    type="text"
                    className="bg-amber-50 rounded-lg rounded-e-none p-3 flex-1 uppercase"
                    value={idValue}
                    onChange={onJoinChange}
                />
                <Button
                    className="text-xl rounded-s-none"
                    onClick={joinGame}
                    disabled={loading}
                >
                    {loading ? "Joining..." : "Join Game"}
                </Button>
            </form>
            <p className="text-red-700 text-center min-h-10 mt-3">{error}</p>
        </div>
    )
}