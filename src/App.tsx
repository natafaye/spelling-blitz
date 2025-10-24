import { useState } from "react";
import Join from "./Join/Join";
import Play from "./Play/Play";

type Props = {}

export default function App({ }: Props) {
  const [gameId, setGameId] = useState<null | string>(null)

  const startGame = (id: string) => {
    setGameId(id)
  }

  return (
    <div>
      {gameId ?
        <Play gameId={gameId}/> :
        <Join onJoin={startGame} />
      }
    </div>
  )
}