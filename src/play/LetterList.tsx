import Button from "../Button"

type Props = {
  letters: string[]
  onLetterClick: (letter: string) => void
}

export default function LetterList({ letters, onLetterClick }: Props) {
  return (
    <div className="flex flex-row gap-2">
      {letters.map((letter, index) =>
        <Button
          key={index}
          className="uppercase text-3xl p-4"
          onClick={() => onLetterClick(letter)}
        >
          {letter}
        </Button>
      )}
    </div>
  )
}