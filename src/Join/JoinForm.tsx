import { useState, type ChangeEvent, type MouseEvent } from "react"
import Button from "../Components/Button"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../shared/firebase"

type Props = {
    onJoin: (id: string) => void
}

export default function JoinForm({ onJoin }: Props) {
    const [loading, setLoading] = useState(false)
    const [idValue, setIdValue] = useState("")
    const [error, setError] = useState<null | string>(null)

    const existsGameWithId = async (id: string) => {
        const docSnapshot = await getDoc(doc(db, "games", id))
        return docSnapshot.exists()
    }

    const onJoinChange = (event: ChangeEvent<HTMLInputElement>) => {
        setIdValue(event.target.value.toLowerCase())
        setError(null)
    }

    const joinGame = async (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()

        setLoading(true)
        if (!await existsGameWithId(idValue)) {
            setError("There isn't a game with that id")
        } else {
            onJoin(idValue)
        }
        setLoading(false)
    }
    return (
        <div>
            <form className="flex gap-3">
                <input
                    type="text"
                    className="border border-gray-500 rounded-lg p-3 flex-1 uppercase"
                    value={idValue}
                    onChange={onJoinChange}
                />
                <Button
                    className="text-xl"
                    onClick={joinGame}
                    disabled={loading}
                >
                    {loading ? "Joining..." : "Join Game"}
                </Button>
            </form>
            <p className="text-red-700 text-center min-h-10">{error}</p>
        </div>
    )
}