import { useState, type ChangeEvent, type MouseEvent } from "react";
import { serverTimestamp, setDoc, doc, getDoc } from "firebase/firestore"
import Button from "./Button";
import { getRandomWord } from "./getRandomWord";
import { db } from "./firebase-config"

const MAX_ATTEMPTS = 5

type Props = {
    onJoin: (id: string) => void
}

export default function Join({ onJoin }: Props) {
    const [createThinking, setCreateThinking] = useState(false)
    const [createError, setCreateError] = useState<null | string>(null)

    const [joinThinking, setJoinThinking] = useState(false)
    const [joinIdValue, setJoinIdValue] = useState("")
    const [joinError, setJoinError] = useState<null | string>(null)

    const existsGameWithId = async (id: string) => {
        const docSnapshot = await getDoc(doc(db, "games", id))
        return docSnapshot.exists()
    }

    const createGame = async () => {
        setCreateThinking(true)

        // Make new game
        const newGame = {
            count: 0,
            pangram: getRandomWord(),
            words: [],
            createdAt: serverTimestamp()
        }

        // Try to generate a unique id
        let id = getRandomWord()
        let attempts = 1
        while (await existsGameWithId(id) && attempts < MAX_ATTEMPTS) {
            id = getRandomWord()
            attempts++
        }
        if (attempts >= MAX_ATTEMPTS) {
            setCreateError("Game limit hit, wait for someone to finish")
            setCreateThinking(false)
            return
        }

        // Add the game to Firestore and join the game
        await setDoc(doc(db, "games", id), newGame)
        onJoin(id)

        setCreateThinking(false)
    }

    const onJoinChange = (event: ChangeEvent<HTMLInputElement>) => {
        setJoinIdValue(event.target.value.toLowerCase())
        setJoinError(null)
    }

    const joinGame = async (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()

        setJoinThinking(true)
        if (!await existsGameWithId(joinIdValue)) {
            setJoinError("There isn't a game with that id")
        } else {
            onJoin(joinIdValue)
        }
        setJoinThinking(false)
    }

    return (
        <div className="flex items-center justify-center h-svh">
            <div>
                <h1 className="text-6xl text-center mb-10">🐝Spelling Blitz</h1>
                <div className="w-full">
                    <Button
                        className="w-full text-2xl"
                        onClick={createGame}
                        disabled={createThinking}
                    >
                        {createThinking ? "Creating..." : "Create Game"}
                    </Button>
                    <p className="text-red-700 text-center">{createError}</p>
                </div>
                <p className="p-4 text-xl text-center">----- or -----</p>
                <form className="flex gap-3">
                    <input
                        type="text"
                        className="border border-gray-500 rounded-lg p-3 flex-1 uppercase"
                        value={joinIdValue}
                        onChange={onJoinChange}
                    />
                    <Button
                        className="text-xl"
                        onClick={joinGame}
                        disabled={joinThinking}
                    >
                        {joinThinking ? "Joining..." : "Join Game"}
                    </Button>
                </form>
                <p className="text-red-700 text-center min-h-10">{joinError}</p>
            </div>
        </div>
    )
}