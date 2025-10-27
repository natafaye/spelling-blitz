import { useEffect, useState } from "react";
import { collection, deleteDoc, doc, Timestamp } from "firebase/firestore";
import Start from "./Start/Start";
import Error from "./Components/Error";
import Ready from "./Ready/Ready";
import Play from "./Play/Play";
import End from "./End/End";
import { useGame } from "./shared/useGame";
import { db } from "./shared/firebase";
import { useLocalStorageState } from "./shared/useLocalStorageState";
import { GAME_LENGTH_IN_SECONDS } from "./shared/constants";

export default function Game() {
    const [playerId] = useLocalStorageState("playerId", doc(collection(db, "games")).id)
    const [gameId, setGameId] = useState<null | string>(null)
    const [secondsFromStart, setSecondsFromStart] = useState<null | number>(null)
    const { game, gameError } = useGame(gameId)

    // Keep track of the seconds from game start for countdown
    useEffect(() => {
        if(!game) return
        const interval = setInterval(() => {
            const newSeconds = !game.startedAt ? null : Timestamp.now().seconds - game.startedAt.seconds
            setSecondsFromStart(newSeconds)
            if(newSeconds && newSeconds > GAME_LENGTH_IN_SECONDS) clearInterval(interval)
        }, 100)
        return () => clearInterval(interval)
    }, [game?.startedAt])

    // Join the game
    const joinGame = (id: string) => {
        setGameId(id)
    }

    // Leave the game
    const leaveGame = () => {
        if(game && gameId && game.hostPlayerId === playerId) {
            deleteDoc(doc(db, "games", gameId))
        }
        setGameId(null)
        setSecondsFromStart(null)
    }

    // If there isn't a gameId, have them create or join a game
    if (!gameId)
        return <Start playerId={playerId} onJoin={joinGame} />

    // If there is a gameId but there's been an error loading, show the error
    if (gameError)
        return <Error message={gameError} />

    // If there's a game id, but no error and no game, wait while it loads
    if (!game)
        return <div>Loading game...</div>

    // If there's a game but if this player hasn't joined or the game hasn't started yet, get ready
    if (!Object.keys(game.players).includes(playerId) || game.startedAt == null || game.startedAt > Timestamp.now())
        return <Ready gameId={gameId} game={game} playerId={playerId} secondsFromStart={secondsFromStart} />

    // If the game's started but not over yet, time to play!
    if(Timestamp.now().seconds - game.startedAt.seconds <= GAME_LENGTH_IN_SECONDS)
        return <Play gameId={gameId} game={game} playerId={playerId} secondsFromStart={secondsFromStart} />

    // If the game is over
    return <End game={game} playerId={playerId} leaveGame={leaveGame}/>
}