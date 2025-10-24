import clsx from "clsx"

type Props = {
  words: string[]
  letters: string[]
}

export default function WordList({ words, letters }: Props) {
  return (
    <div className="uppercase bg-amber-50 rounded p-3 border border-amber-300 columns-2">
      {words.slice().sort().map(word => (
        <>
          <span key={word} className={clsx(letters.every(l => word.includes(l)) && "font-bold")}>{word}</span>
          <br />
        </>
      ))}
    </div>
  )
}