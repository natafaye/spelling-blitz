import clsx from "clsx"
import { Fragment } from "react/jsx-runtime"

type Props = {
  words: string[]
  letters: string[]
  className?: string
}

export default function WordList({ words, letters, className }: Props) {
  return (
    <div className={clsx(className, "uppercase bg-amber-50 rounded-lg p-5 columns-2")}>
      {words.slice().sort().map(word => (
        <Fragment key={word}>
          <span key={word} className={clsx(letters.every(l => word.includes(l)) && "font-bold")}>{word}</span>
          <br />
        </Fragment>
      ))}
    </div>
  )
}