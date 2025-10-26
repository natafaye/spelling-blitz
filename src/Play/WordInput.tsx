import { useState, type ChangeEvent, type MouseEvent } from "react"
import Button from "../Components/Button"
import LetterList from "./LetterList"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faDeleteLeft, faShuffle } from "@fortawesome/free-solid-svg-icons"

type Props = {
    letters: string[]
    className?: string
    onEnter: (word: string) => void
    onShuffle: () => void
    clearError: () => void
}

export default function WordInput({ letters, className, onEnter, onShuffle, clearError }: Props) {
    const [wordValue, setWordValue] = useState("")

    const handleDelete = () => {
        setWordValue(wordValue.slice(0, -1))
    }

    const handleLetterClick = (letter: string) => {
        setWordValue(wordValue + letter)
        clearError()
    }

    const handleWordChange = (event: ChangeEvent<HTMLInputElement>) => {
        setWordValue(event.target.value.toLowerCase())
        clearError()
    }

    const handleEnter = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        onEnter(wordValue)
        setWordValue("")
    }

    return (
        <div className={className}>
            <LetterList
                letters={letters}
                onLetterClick={handleLetterClick}
            />
            <form className="flex gap-1 mt-4 flex-wrap">
                <input
                    type="text"
                    className="bg-amber-50 rounded-lg p-3 rounded-e-none uppercase min-w-36 flex-1"
                    value={wordValue}
                    onChange={handleWordChange}
                    autoFocus={true}
                />
                <Button onClick={handleEnter} className="rounded-s-none -ms-1">Enter</Button>
                <Button onClick={handleDelete} type="button"><FontAwesomeIcon icon={faDeleteLeft} size="lg"/></Button>
                <Button onClick={onShuffle} type="button"><FontAwesomeIcon icon={faShuffle}/></Button>
            </form>
        </div>
    )
}