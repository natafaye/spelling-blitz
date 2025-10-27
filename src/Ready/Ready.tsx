import { useEffect, useState, type ChangeEvent, type MouseEvent } from "react";
import { doc, Timestamp, updateDoc } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareCheck, faSquareXmark } from "@fortawesome/free-solid-svg-icons";
import Button from "../Components/Button";
import PlayerCard from "./PlayerCard";
import type { Game, Player } from "../shared/types";
import { db } from "../shared/firebase";
import { useLocalStorageState } from "../shared/useLocalStorageState";
import { DEFAULT_PLAYER_COLOR } from "../shared/constants";

type Props = {
  gameId: string;
  game: Game;
  playerId: string;
  secondsFromStart: null | number;
};

export default function Ready({ gameId, game, playerId, secondsFromStart }: Props) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [colorValue, setColorValue] = useLocalStorageState("playerColor", DEFAULT_PLAYER_COLOR);
  const playerIds = Object.keys(game.players).sort();
  const [nameValue, setNameValue] = useLocalStorageState("playerName", "player" + (playerIds.length + 1));

  const allPlayersReady = playerIds.length > 0 && playerIds.every((p) => game.players[p].ready);
  useEffect(() => {
    // If this player is the host
    if (playerId === game.hostPlayerId) {
      // If all the players are ready (including host), but the game isn't started, then start the game
      if (allPlayersReady && ready && !game.startedAt) {
        updateDoc(doc(db, "games", gameId), {
          startedAt: new Timestamp(
            Timestamp.now().seconds + 10,
            Timestamp.now().nanoseconds
          ),
        });
        // If all the players aren't ready, but the game is about to start, stop it
      } else if (
        !allPlayersReady &&
        game.startedAt &&
        Timestamp.now() < game.startedAt
      ) {
        updateDoc(doc(db, "games", gameId), {
          startedAt: null,
        });
      }
    }
  }, [allPlayersReady]);

  const validate = (updatedData?: Partial<Player>) => {
    const { name, color } = {
      name: nameValue,
      color: colorValue,
      ...updatedData,
    };

    let valid = false;
    if (name.match(/\s/))
      setError("No spaces allowed");
    else if (name.length > 10)
      setError("Too long");
    else if (playerIds.some((id) => id !== playerId && game.players[id].name === name))
      setError("Name already taken");
    else if (playerIds.some((id) => id !== playerId && game.players[id].color === color))
      setError("Color already taken");
    else {
      setError("");
      valid = true;
    }

    return valid;
  };

  const updatePlayer = (updatedData?: Partial<Player>) => {
    if (!validate()) return;
    updateDoc(doc(db, "games", gameId), {
      ["players." + playerId]: {
        name: nameValue,
        color: colorValue,
        ready: ready,
        ...updatedData,
      },
    });
  };

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newName = event.target.value;
    setNameValue(newName);
    validate({ name: newName });
  };

  const handleColorChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newColor = event.target.value;
    setColorValue(newColor);
    validate({ color: newColor });
  };

  const handleUpdateClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    updatePlayer();
  };

  const handleReady = () => {
    setReady(!ready);
    updatePlayer({ ready: !ready });
  };

  return (
    <div className="my-auto">
      <h2 className="text-3xl mb-4">Who Are You?</h2>
      <form className="flex items-center gap-2 mb-1">
        <input
          type="color"
          aria-label="Color"
          className="h-12"
          value={colorValue}
          onChange={handleColorChange}
        />
        <input
          type="text"
          aria-label="Name"
          className="bg-amber-50 rounded-lg p-3 flex-1"
          value={nameValue}
          onChange={handleNameChange}
        />
        <Button onClick={handleUpdateClick}>
          {playerIds.includes(playerId) ? "Update" : "Join"}
        </Button>
      </form>
      <p className="mb-4 min-h-6 text-red-700">{error}</p>
      <h3 className="text-3xl mb-3">Players In Game</h3>
      <p>
        Game Code:
        <span className="uppercase mx-2 font-bold text-amber-800">
          {gameId}
        </span>
        (share this with your friends)
      </p>
      <div className="bg-amber-50 min-h-50 mt-3 mb-5 p-2 rounded-lg flex flex-wrap content-start">
        {!playerIds.length && (
          <p className="text-amber-800">Looking a bit lonely right now...</p>
        )}
        {playerIds.map((pId) => (
          <PlayerCard
            key={pId}
            player={game.players[pId]}
            isSelf={pId === playerId}
            className="w-1/2 grow-0"
          />
        ))}
      </div>
      <Button onClick={handleReady} className="w-full" variant={ready ? "success" : "danger"}>
        <FontAwesomeIcon
          icon={ready ? faSquareCheck : faSquareXmark}
          size="lg"
          className="me-2"
        />
        Ready to Start
      </Button>
      <p className="text-center mt-2 min-h-6 text-amber-800">
        {secondsFromStart !== null && (
          secondsFromStart < 0 ?
            "Starting in " + (secondsFromStart * -1) + "..." :
            "Game started! Refresh the page"
        )}
      </p>
    </div>
  );
}
