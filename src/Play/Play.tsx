import { arrayUnion, doc, updateDoc } from "firebase/firestore"
import { useState } from "react"
import WordList from "./WordList"
import ProgressBar from "../Components/ProgressBar"
import WordInput from "./WordInput"
import { getAllPoints, isValidWord, toShuffle } from "../shared/utilities"
import type { Game } from "../shared/types"
import { db } from "../shared/firebase"

type Props = {
    gameId: string
    game: Game
    playerName: string
}

export default function Play({ gameId, game }: Props) {
    const [letters, setLetters] = useState<string[]>(game.letters)
    const [errorMessage, setErrorMessage] = useState("")

    const handleShuffle = () => setLetters(toShuffle(letters))
    const clearError = () => setErrorMessage("")

    const gameRef = doc(db, "games", gameId)

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
        <>
            <h1 className="text-3xl text-center mt-1 mb-3">🐝Spelling Blitz</h1>
            <div className="flex justify-between items-center mb-2">
                <p className="text-amber-700">Game Code: {gameId.toUpperCase()}</p>
                <p className="font-bold text-lg">3:00</p>
            </div>
            <ProgressBar
                value={getAllPoints(game.words, letters)}
                max={game.maxPoints}
                className="mb-4"
            />
            <WordList
                words={game.words}
                letters={letters}
                className="overflow-y-auto shrink grow min-h-0 mb-4"
            />
            <WordInput
                letters={letters}
                onEnter={addWord}
                onShuffle={handleShuffle}
                clearError={clearError}
            />
            <p className="min-h-8 mt-2 mb-1 text-amber-700">
                {errorMessage}
            </p>
        </>
    )
}