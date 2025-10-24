import { arrayUnion, doc, onSnapshot, updateDoc } from "firebase/firestore"
import { useEffect, useRef, useState, type ChangeEvent, type MouseEvent } from "react"
import WordList from "./WordList"
import LetterList from "./LetterList"
import Button from "../Components/Button"
import { db } from "../shared/firebase"
import type { Game } from "../shared/types"
import { getAllPoints, getAllWords, getUniqueLetters, isValidWord, toShuffle } from "../shared/utilities"
import ProgressBar from "./ProgressBar"

type Props = {
    gameId: string
}

export default function Play({ gameId }: Props) {
    const [wordValue, setWordValue] = useState("")
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

    const handleShuffle = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        setLetters(toShuffle(letters))
    }

    const handleLetterClick = (letter: string) => {
        setWordValue(wordValue + letter)
        setErrorMessage("")
    }

    const handleWordChange = (event: ChangeEvent<HTMLInputElement>) => {
        setWordValue(event.target.value.toLowerCase())
        setErrorMessage("")
    }

    const addWord = async (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()

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

        // Clear the textbox
        setWordValue("")
    }

    return (
        <div className="mx-auto max-w-120">
            <h1 className="text-3xl text-center my-4">🐝Spelling Blitz</h1>
            <p>Game Code: {gameId.toUpperCase()}</p>
            {!gameLoaded ? <div>Loading...</div> :
                <>
                    <ProgressBar
                        value={game && getAllPoints(game.words, letters) || 0}
                        max={allWords.current && getAllPoints(allWords.current, letters) || 100}
                        className="mb-3"
                    />
                    <div>
                        <LetterList letters={letters} onLetterClick={handleLetterClick} />
                    </div>
                    <form className="flex gap-3 my-4">
                        <input
                            type="text"
                            className="border border-gray-500 bg-amber-50 rounded-lg p-3 flex-1 uppercase"
                            value={wordValue}
                            onChange={handleWordChange}
                            autoFocus={true}
                        />
                        <Button onClick={addWord}>Enter</Button>
                        <Button onClick={handleShuffle}>Shuffle</Button>
                    </form>
                    <p className="min-h-8">{errorMessage}</p>
                    {game && <WordList words={game.words} letters={letters} />}
                </>
            }
        </div>
    )
}