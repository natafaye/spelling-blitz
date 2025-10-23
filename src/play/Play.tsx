import { arrayUnion, doc, onSnapshot, updateDoc } from "firebase/firestore"
import { db } from "../firebase-config"
import { useEffect, useState, type MouseEvent } from "react"
import Button from "../Button"
import type { Game } from "../types"
import WordList from "./WordList"
import { shuffle } from "../shuffle"
import LetterList from "./LetterList"

type Props = {
    gameId: string
}

export default function Play({ gameId }: Props) {
    const [wordValue, setWordValue] = useState("")
    const [game, setGame] = useState<Game | null>(null)
    const [letters, setLetters] = useState<string[]>([])

    const gameRef = doc(db, "games", gameId)

    useEffect(() => {
        const unsubscribe = onSnapshot(gameRef, (docSnapshot) => {
            if (!docSnapshot.exists()) return
            const game = docSnapshot.data() as Game
            console.log("updating")
            setGame(game)
            if(letters.length === 0) shuffleLetters(game)
        })
        return () => unsubscribe()
    }, [])

    const shuffleLetters = (game: Game) => {
        const letters = game.pangram.split("")
        shuffle(letters)
        setLetters(letters)
    }

    const addWord = async (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()

        if (!game) return

        // Don't allow duplicates
        if (game.words.includes(wordValue)) return

        // Add to firebase
        await updateDoc(gameRef, {
            words: arrayUnion(wordValue)
        })

        // Clear the textbox
        setWordValue("")
    }

    const handleLetterClick = (letter: string) => {
        setWordValue(wordValue + letter)
    }

    return (
        <div>
            <h1 className="text-3xl text-center my-4">🐝Spelling Blitz</h1>
            <div>
                <LetterList letters={letters} onLetterClick={handleLetterClick}/>
            </div>
            <div className="w-56 p-3">
                <form className="flex gap-3 my-4">
                    <input
                        type="text"
                        className="border border-gray-500 rounded-lg p-3 flex-1 uppercase"
                        value={wordValue}
                        onChange={(e) => setWordValue(e.target.value)}
                    />
                    <Button onClick={addWord}>Enter</Button>
                </form>
                {game && <WordList words={game.words} />}
            </div>
        </div>
    )
}