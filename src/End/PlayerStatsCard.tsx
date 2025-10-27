import clsx from "clsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCrown } from "@fortawesome/free-solid-svg-icons";
import type { PlayerStats } from "./generatePlayerStats";
import { useState } from "react";

type Props = {
  player: PlayerStats;
  letters: string[];
  isSelf: boolean;
  highestTotal: number;
  highestUnique: number;
  className?: string;
};
export default function PlayerStatsCard({
  player,
  letters,
  isSelf,
  highestTotal,
  highestUnique,
  className,
}: Props) {
  const [showWords, setShowWords] = useState(false);

  return (
    <div className={className}>
      <h4
        className={clsx(
          isSelf && "font-bold",
          "text-2xl flex items-center gap-2"
        )}
      >
        <div
          className="w-6 h-6 rounded"
          style={{ backgroundColor: player.color }}
        />
        {player.name}
      </h4>
      <div className="flex gap-3 mt-2">
        <div className="flex-1">
          <h6 className="text-sm">Total Points</h6>
          <p className={clsx("text-xl", player.totalPoints === highestTotal && "font-bold")}>
            {player.totalPoints}
            {player.totalPoints === highestTotal && (
              <FontAwesomeIcon icon={faCrown} className="text-amber-500 ms-2" />
            )}
          </p>
        </div>
        <div className="flex-1">
          <h6 className="text-sm">Unique Points</h6>
          <p className={clsx("text-xl", player.uniquePoints === highestUnique && "font-bold")}>
            {player.uniquePoints}
            {player.uniquePoints === highestUnique && (
              <FontAwesomeIcon icon={faCrown} className="text-amber-500 ms-2" />
            )}
          </p>
        </div>
        <div className="flex-1">
          <h6 className="text-sm">Longest Unique</h6>
          <p className="text-xl">
            {player.longestUniqueWord[0].toUpperCase() +
              player.longestUniqueWord.slice(1)}
          </p>
        </div>
      </div>
      <div className="mt-2">
        <button
          className="text-sm text-amber-800"
          onClick={() => setShowWords(!showWords)}
        >
          <FontAwesomeIcon icon={faCaretDown} />
          Unique Words
        </button>
        {showWords && (
          <div className="ms-2">
            {player.uniqueWords
              .sort((a, b) => b.length - a.length)
              .map((word, index) => (
                <span
                  className={clsx(
                    letters.every((l) => word.includes(l)) && "font-bold"
                  )}
                >
                  {word}
                  {index !== player.uniqueWords.length - 1 && ", "}
                </span>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
