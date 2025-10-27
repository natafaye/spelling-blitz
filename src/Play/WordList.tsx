import clsx from "clsx"
import type { Game } from "../shared/types"

type Props = {
  game: Game
  playerId: string
  words: string[]
  className?: string
}

export default function WordList({ game, playerId, words, className }: Props) {
  return (
    <div className={clsx(className, "uppercase bg-amber-50 rounded-lg pt-4 flex flex-wrap content-start")}>
      {words.slice().sort().map(word => (
        <div key={word} className="w-1/2 flex items-center justify-between mb-3 px-4">
          <div className={clsx(
            game.letters.every(l => word.includes(l)) && "font-bold",
            game.words[word].length > 1 && "text-neutral-400"
          )}>{word}</div>
          <div className="flex gap-1">
            {game.words[word].filter(pId => pId !== playerId).map(pId => (
              <div key={pId} className="w-4 h-4 rounded" style={{ backgroundColor: game.players[pId].color }}></div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}