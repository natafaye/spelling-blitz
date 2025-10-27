import { useMemo, useState } from "react"
import { doc, serverTimestamp, setDoc } from "firebase/firestore"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCaretDown, faCog } from "@fortawesome/free-solid-svg-icons"
import RangeInput from "../Components/RangeInput"
import Button from "../Components/Button"
import { getAllPoints, getAllWords, getRandomWord, getUniqueLetters, toShuffle } from "../shared/utilities"
import { db } from "../shared/firebase"
import { wordlist } from "../shared/wordlist"
import { existsGameWithId } from "./existsGameWithId"
import { DEFAULT_MIN_WORD_LENGTH, DEFAULT_NUMBER_OF_LETTERS, DEFAULT_OBSCURITY, MAX_GAME_ID_ATTEMPTS } from "../shared/constants"

type Props = {
    onJoin: (id: string) => void
    playerId: string
}

export default function CreateForm({ onJoin, playerId }: Props) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<null | string>(null)
    const [showSettings, setShowSettings] = useState(false)
    const [obscurityValue, setObscurityValue] = useState(DEFAULT_OBSCURITY.toString())
    const [minWordLengthValue, setMinWordLengthValue] = useState(DEFAULT_MIN_WORD_LENGTH.toString())
    const [numberOfLettersValue, setNumberOfLettersValue] = useState(DEFAULT_NUMBER_OF_LETTERS.toString())

    const mostObscureWords = useMemo(
        () => wordlist.slice(parseInt(obscurityValue) - 5, parseInt(obscurityValue) + 5),
        [obscurityValue]
    )

    const createGame = async () => {
        setLoading(true)

        // Generate all the data
        const obscurityLevel = parseInt(obscurityValue);
        const numLetters = parseInt(numberOfLettersValue);
        const minLength = parseInt(minWordLengthValue)
        const pangram = getRandomWord(obscurityLevel, numLetters)
        const letters = toShuffle(getUniqueLetters(pangram))
        const allWords = getAllWords(letters, obscurityLevel, minLength)
        const maxPoints = getAllPoints(allWords, letters)

        // Make new game
        const newGame = {
            obscurityLevel,
            numLetters,
            minLength,
            letters,
            allWords,
            maxPoints,
            words: {},
            players: {},
            hostPlayerId: playerId,
            createdAt: serverTimestamp(),
            startedAt: null
        }

        // Try to generate a unique word id
        // Allow a certain number of attempts to get an id that hasn't already been taken
        // It seems highly unlikely that the word will be already taken, but not impossible
        let id = getRandomWord(1000)
        let attempts = 1
        while (await existsGameWithId(id) && attempts < MAX_GAME_ID_ATTEMPTS) {
            id = getRandomWord()
            attempts++
        }
        if (attempts >= MAX_GAME_ID_ATTEMPTS) {
            setError("Couldn't get a unique game id, try again")
            setLoading(false)
            return
        }

        // Add the game to Firestore and join the game
        await setDoc(doc(db, "games", id), newGame)
        onJoin(id)

        setLoading(false)
    }


    return (
        <div>
            <div className="flex gap-1">
                <Button
                    className="w-full text-2xl rounded-e-none"
                    onClick={createGame}
                    disabled={loading}
                >
                    {loading ? "Creating..." : "Create Game"}
                </Button>
                <Button className="rounded-s-none" title="Settings" onClick={() => setShowSettings(!showSettings)}>
                    <FontAwesomeIcon icon={showSettings ? faCaretDown : faCog} />
                </Button>
            </div>
            <p className="text-red-700 text-center">{error}</p>
            {showSettings && (
                <div className="mt-4 mx-2">
                    <RangeInput
                        label="Minimum Word Length"
                        valueClassName="w-4"
                        className="mb-3"
                        min={2}
                        max={6}
                        value={minWordLengthValue}
                        onChange={(e) => setMinWordLengthValue(e.target.value)}
                    />
                    <RangeInput
                        label="Number of Letters"
                        valueClassName="w-4"
                        className="mb-3"
                        min={4}
                        max={12}
                        value={numberOfLettersValue}
                        onChange={(e) => setNumberOfLettersValue(e.target.value)}
                    />
                    <RangeInput
                        label="Obscurity"
                        valueClassName="w-12"
                        min={800}
                        max={wordlist.length - 1}
                        step={100}
                        value={obscurityValue}
                        onChange={(e) => setObscurityValue(e.target.value)}
                    />
                    <div className="flex flex-row justify-stretch mb-3 text-sm">
                        <div className="bg-linear-to-r from-amber-200 to-transparent w-20 -me-20 relative"></div>
                        <p className="text-amber-700 text-nowrap text-center flex-1 overflow-hidden">{mostObscureWords.join(", ")}</p>
                        <div className="bg-linear-to-l from-amber-200 to-transparent w-20 -ms-20 relative"></div>
                    </div>
                </div>
            )}

        </div>
    )
}