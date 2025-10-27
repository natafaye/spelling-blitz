import { useMemo } from "react";
import type { Game, } from "../shared/types";
import PlayerStatsCard from "./PlayerStatsCard";
import { generatePlayerStats } from "./generatePlayerStats";
import Button from "../Components/Button";

type Props = {
    game: Game;
    playerId: string;
    leaveGame: () => void;
};

export default function End({ game, playerId, leaveGame }: Props) {
    const playersStats = useMemo(() => generatePlayerStats(game), [game]);

    const highestTotal = playersStats.reduce((highest, player) => Math.max(player.totalPoints, highest), 0)
    const highestUnique = playersStats.reduce((highest, player) => Math.max(player.uniquePoints, highest), 0)

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
            </div>
            <Button onClick={leaveGame} className="mt-auto">Leave Game</Button>
        </>
    );
}
