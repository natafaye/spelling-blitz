import { useEffect, useMemo, useState } from "react";
import PlayerStatsCard from "./PlayerStatsCard";
import CollapsibleWordList from "./CollapsibleWordList";
import Button from "../Components/Button";
import { generatePlayerStats } from "./generatePlayerStats";
import type { Game } from "../shared/types";

type Props = {
  game: Game;
  playerId: string;
  leaveGame: () => void;
};

export default function End({ game, playerId, leaveGame }: Props) {
  // Disable button for first few seconds to prevent accidental game leaving
  const [leaveDisabled, setLeaveDisabled] = useState(true)
  useEffect(() => {
    const timeout = setTimeout(() => setLeaveDisabled(false), 2000)
    return () => clearTimeout(timeout)
  }, [])
  
  const playersStats = useMemo(() => generatePlayerStats(game), [game]);
  const missedWords = game.allWords.filter((w) => !game.words[w]).sort();
  const highestTotal = playersStats.reduce(
    (highest, player) => Math.max(player.totalPoints, highest),
    0
  );
  const highestUnique = playersStats.reduce(
    (highest, player) => Math.max(player.uniquePoints, highest),
    0
  );

  return (
    <>
      <h3 className="text-center text-3xl mb-5">Game Ended</h3>
      <hr />
      <div className="overflow-y-auto pb-5">
        {playersStats.map((player) => (
          <>
            <PlayerStatsCard
              key={player.id}
              player={player}
              highestTotal={highestTotal}
              highestUnique={highestUnique}
              letters={game.letters}
              isSelf={player.id === playerId}
              className="mt-5"
            />
            <hr className="mt-5" />
          </>
        ))}
        <CollapsibleWordList
          className="mt-5 -ms-1"
          buttonLabel="Missed Words"
          wordList={missedWords}
          letters={game.letters}
        />
      </div>
      <Button onClick={leaveGame} className="mt-auto" disabled={leaveDisabled}>
        Leave Game
      </Button>
    </>
  );
}
