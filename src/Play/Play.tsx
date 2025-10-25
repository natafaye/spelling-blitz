import { arrayUnion, doc, onSnapshot, updateDoc } from "firebase/firestore"
import { useEffect, useRef, useState } from "react"
import WordList from "./WordList"
import ProgressBar from "./ProgressBar"
import WordInput from "./WordInput"
import { db } from "../shared/firebase"
import type { Game } from "../shared/types"
import { getAllPoints, getAllWords, getUniqueLetters, isValidWord, toShuffle } from "../shared/utilities"

type Props = {
    gameId: string
}

export default function Play({ gameId }: Props) {
    const [errorMessage, setErrorMessage] = useState("")

    const [game, setGame] = useState<Game | null>(null)
    const [gameLoaded, setGameLoaded] = useState(false)
    const [letters, setLetters] = useState<string[]>([])
    const allWords = useRef<string[]>(null)
    const maxPoints = useRef<number>(null)

    const gameRef = doc(db, "games", gameId)

    useEffect(() => {
        const unsubscribe = onSnapshot(gameRef, (docSnapshot) => {
            if (!docSnapshot.exists()) return
            const game = docSnapshot.data() as Game
            setGame(game)
            if (!gameLoaded) {
                const letters = getUniqueLetters(game.pangram)
                setLetters(toShuffle(letters))
                allWords.current = getAllWords(letters, game.obscurityLevel, game.minLength)
                maxPoints.current = getAllPoints(allWords.current, letters)
                setGameLoaded(true)
            }
        })
        return () => unsubscribe()
    }, [gameLoaded])

    const handleShuffle = () => {
        setLetters(toShuffle(letters))
    }

    const clearError = () => {
        setErrorMessage("")
    }

    const addWord = async (wordValue: string) => {
        if (!game) return

        // Is it a duplicate
        if (game.words.includes(wordValue)) {
            setErrorMessage("Already found")
        }
        // Does it use invalid letters
        else if (wordValue.split("").some(letter => !letters.includes(letter))) {
            setErrorMessage("Invalid letters")
        }
        // Is it too short
        else if (wordValue.length < game.minLength) {
            setErrorMessage("Too short")
        }
        // Is it an invalid word
        else if (!isValidWord(wordValue, game.obscurityLevel)) {
            setErrorMessage("Not an accepted word")
        }
        // Add to firebase
        else {
            updateDoc(gameRef, {
                words: arrayUnion(wordValue)
            })
        }
    }

    return (
        <div className="mx-auto max-w-120 p-3">
            <h1 className="text-3xl text-center mt-4 mb-3">🐝Spelling Blitz</h1>
            <div className="flex justify-between">
                <p className="text-center text-amber-700 mb-3">Game Code: {gameId.toUpperCase()}</p>
                <p className="font-bold">3:00</p>
            </div>
            {!gameLoaded ?
                <div>Loading...</div> :
                <>
                    <ProgressBar
                        value={game && getAllPoints(game.words, letters) || 0}
                        max={allWords.current && getAllPoints(allWords.current, letters) || 100}
                        className="mb-3"
                    />
                    <WordInput
                        letters={letters}
                        onEnter={addWord}
                        onShuffle={handleShuffle}
                        clearError={clearError}
                    />
                    <p className="min-h-8 mt-2 text-amber-700">{errorMessage}</p>
                    {game && <WordList words={game.words} letters={letters} />}
                </>
            }
        </div>
    )
}