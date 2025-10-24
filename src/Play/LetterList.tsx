import Button from "../Components/Button"

type Props = {
  letters: string[]
  onLetterClick: (letter: string) => void
}

export default function LetterList({ letters, onLetterClick }: Props) {
  return (
    <div className="flex flex-row gap-1">
      {letters.map(letter =>
        <Button
          key={letter}
          className="uppercase text-2xl p-4 flex-1 basis-0"
          onClick={() => onLetterClick(letter)}
        >
          {letter}
        </Button>
      )}
    </div>
  )
}