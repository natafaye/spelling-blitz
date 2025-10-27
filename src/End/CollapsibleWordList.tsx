import { faCaretDown, faCaretRight } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import clsx from "clsx"
import { useState, type HTMLAttributes, type ReactNode } from "react"

type Props = HTMLAttributes<HTMLDivElement> & {
  buttonLabel?: ReactNode
  wordList: string[]
  letters: string[]
}

export default function CollapsibleWordList({ buttonLabel, wordList, letters, ...props }: Props) {
  const [show, setShow] = useState(false)
  return (
    <div {...props}>
      <button
        className="text-sm text-amber-800"
        onClick={() => setShow(!show)}
      >
        <FontAwesomeIcon icon={show ? faCaretDown : faCaretRight} />
        {buttonLabel}
      </button>
      {show && (
        <div className="ms-2">
          {wordList.map((word, index) => (
            <span
              className={clsx(
                letters.every((l) => word.includes(l)) && "font-bold"
              )}
            >
              {word}
              {index !== wordList.length - 1 && ", "}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}