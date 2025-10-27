import { useState } from "react";
import Start from "./Start/Start";
import Ready from "./Ready/Ready";
import Play from "./Play/Play";
import { useGame } from "./shared/useGame";

export default function Game() {
    const [gameId, setGameId] = useState<null | string>(null)
    const [playerName, setPlayerName] = useState<null | string>(null)

    const { game, gameError } = useGame(gameId)

    const joinGame = (id: string) => {
        setGameId(id)
    }

    const readyGame = (name: string) => {
        setPlayerName(name)
    }

    // If there isn't a gameId, have them create or join a game
    if (!gameId)
        return <Start onJoin={joinGame} />

    // If there is a gameId but there's been an error loading, show the error
    if (gameError)
        return <div>{gameError}</div>

    // If there's a game id, but no error and no game, wait while it loads
    if (!game)
        return <div>Loading game...</div>

    // If there's a game but no player name, have them pick one
    if (!playerName)
        return <Ready gameId={gameId} game={game} onReady={readyGame} />

    // If there's a game and a player name, time to play!
    return <Play gameId={gameId} game={game} playerName={playerName} />
}