import { Fragment, useState } from "react"
import Button from "../Components/Button"
import { getRandomWord } from "../shared/utilities"
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore"
import { db } from "../shared/firebase"
import { wordlist } from "../shared/wordlist"

type Props = {
    onJoin: (id: string) => void
}

const MAX_ATTEMPTS = 5

export default function CreateForm({ onJoin }: Props) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<null | string>(null)
    const [obscurityValue, setObscurityValue] = useState("18000")
    const [minWordLengthValue, setMinWordLengthValue] = useState("4")

    const mostObscureWords = [
        wordlist[parseInt(obscurityValue) - 1],
        wordlist[parseInt(obscurityValue)]
    ]

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
            minLength: parseInt(minWordLengthValue),
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
            <div>
                <label htmlFor="obscurity-range" className="text-lg">Obscurity</label>
                <div className="flex flex-row gap-2 pb-3 items-center">
                    <p className="w-15">
                        {obscurityValue}
                    </p>
                    <input
                        type="range"
                        id="obscurity-range"
                        className="flex-1 accent-amber-800"
                        min={800}
                        max={wordlist.length - 1}
                        step={100}
                        value={obscurityValue}
                        onChange={(e) => setObscurityValue(e.target.value)}
                    />
                    <p className="w-20">
                        {mostObscureWords.map(word => <Fragment key={word}>{word}<br /></Fragment>)}
                    </p>
                </div>
            </div>
            <div>
                <label htmlFor="word-length-range" className="text-lg">Minimum Word Length</label>
                <div className="flex flex-row gap-2 pb-3 items-center">
                    <p className="w-4 text-amber-800 font-bold">
                        {minWordLengthValue}
                    </p>
                    <input
                        type="range"
                        id="word-length-range"
                        className="flex-1 accent-amber-800"
                        min={2} 
                        max={6}
                        value={minWordLengthValue}
                        onChange={(e) => setMinWordLengthValue(e.target.value)}
                    />
                </div>
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