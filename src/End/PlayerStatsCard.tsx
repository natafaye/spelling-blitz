import clsx from "clsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrown } from "@fortawesome/free-solid-svg-icons";
import type { PlayerStats } from "./generatePlayerStats";
import CollapsibleWordList from "./CollapsibleWordList";

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
          <p
            className={clsx(
              "text-xl",
              player.totalPoints === highestTotal && "font-bold"
            )}
          >
            {player.totalPoints}
            {player.totalPoints === highestTotal && (
              <FontAwesomeIcon icon={faCrown} className="text-amber-500 ms-2" />
            )}
          </p>
        </div>
        <div className="flex-1">
          <h6 className="text-sm">Unique Points</h6>
          <p
            className={clsx(
              "text-xl",
              player.uniquePoints === highestUnique && "font-bold"
            )}
          >
            {player.uniquePoints}
            {player.uniquePoints === highestUnique && (
              <FontAwesomeIcon icon={faCrown} className="text-amber-500 ms-2" />
            )}
          </p>
        </div>
        <div className="flex-1">
          <h6 className="text-sm">Longest Unique</h6>
          <p className="text-xl">{player.longestUniqueWord}</p>
        </div>
      </div>
      <CollapsibleWordList
        className="mt-2 -ms-1"
        buttonLabel="Unique Words"
        wordList={player.uniqueWords.sort((a, b) => b.length - a.length)}
        letters={letters}
      />
    </div>
  );
}
