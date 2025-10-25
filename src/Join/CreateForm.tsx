import { useState } from "react"
import Button from "../Components/Button"
import { getRandomWord } from "../shared/utilities"
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore"
import { db } from "../shared/firebase"
import { words } from "popular-english-words"

type Props = {
    onJoin: (id: string) => void
}

const MAX_ATTEMPTS = 5

export default function CreateForm({ onJoin }: Props) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<null | string>(null)
    const [obscurityValue, setObscurityValue] = useState("20000")

    const mostObscureWord = words.getWordAtPosition(parseInt(obscurityValue))

    const existsGameWithId = async (id: string) => {
        const docSnapshot = await getDoc(doc(db, "games", id))
        return docSnapshot.exists()
    }

    const createGame = async () => {
        setLoading(true)

        const obscurityLevel = parseInt(obscurityValue);
        const numLetters = 7;

        // Make new game
        const newGame = {
            count: 0,
            words: [],
            pangram: getRandomWord(obscurityLevel, numLetters),
            obscurityLevel,
            numLetters,
            minLength: 4,
            createdAt: serverTimestamp()
        }

        // Try to generate a unique id
        let id = getRandomWord(1000)
        let attempts = 1
        while (await existsGameWithId(id) && attempts < MAX_ATTEMPTS) {
            id = getRandomWord()
            attempts++
        }
        if (attempts >= MAX_ATTEMPTS) {
            setError("Couldn't get a unique game id")
            setLoading(false)
            return
        }

        // Add the game to Firestore and join the game
        await setDoc(doc(db, "games", id), newGame)
        onJoin(id)

        setLoading(false)
    }


    return (
        <div className="w-full">
            <div className="flex flex-row gap-2 pb-3">
                <input type="range"
                    min="10000"
                    max="200000"
                    className="flex-1"
                    value={obscurityValue}
                    onChange={(e) => setObscurityValue(e.target.value)}
                />
                <p className="w-20">{mostObscureWord}</p>
            </div>
            <Button
                className="w-full text-2xl"
                onClick={createGame}
                disabled={loading}
            >
                {loading ? "Creating..." : "Create Game"}
            </Button>
            <p className="text-red-700 text-center">{error}</p>
        </div>
    )
}