import { useState, type ChangeEvent } from "react";
import Button from "../Components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import type { Game } from "../shared/types";

type Props = {
  gameId: string;
  game: Game
  onReady: (name: string) => void;
};

export default function Ready({ gameId, onReady }: Props) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("")
  const [nameValue, setNameValue] = useState("Player 1")
  const [colorValue, setColorValue] = useState("#bb4d00")

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newName = event.target.value
    setNameValue(newName)

    if (newName.match(/\s/))
      setError("No spaces allowed in name")
  }

  const handleReady = () => {
    setReady(!ready)
    onReady(nameValue)
  }

  return (
    <div className="my-auto">
      <h2 className="text-3xl mb-4">Who Are You?</h2>
      <div className="flex items-center gap-2 mb-1">
        <input
          type="color"
          className="h-12"
          value={colorValue}
          onChange={(e) => setColorValue(e.target.value)}
        />
        <input
          type="text"
          aria-label="Name"
          className="bg-amber-50 rounded-lg p-3 flex-1"
          value={nameValue}
          onChange={handleNameChange}
        />
      </div>
      <p className="mb-4 min-h-6 text-red-700">{error}</p>
      <h3 className="text-3xl mb-3">Players In Game</h3>
      <p>
        Game Code:
        <span className="uppercase mx-2 font-bold text-amber-800">{gameId}</span>
        (share this with your friends)
      </p>
      <div className="min-h-50 mt-3 mb-5 bg-amber-50 rounded-lg p-3">
        <p className="text-amber-800">Looking a bit lonely right now...</p>
      </div>
      <Button onClick={handleReady} className="w-full ">
        <FontAwesomeIcon
          icon={ready ? faCheck : faTimes}
          size="lg"
          className="me-2"
        />
        Ready to Start
      </Button>
      <div></div>
    </div>
  );
}
