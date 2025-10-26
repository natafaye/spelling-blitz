import { useEffect, useState } from "react";
import type { Game } from "./types";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

export const useGame = (gameId: string | null) => {
  const [game, setGame] = useState<Game | null>(null);
  const [gameError, setGameError] = useState("");

  useEffect(() => {
    if (!gameId) return;

    const unsubscribe = onSnapshot(doc(db, "games", gameId), (docSnapshot) => {
      if (!docSnapshot.exists()) {
        setGameError("Uh oh! Couldn't find the game");
        return;
      }
      const game = docSnapshot.data() as Game;
      setGame(game);
    });

    return () => unsubscribe();
  }, [gameId]);

  return {
    game,
    gameError,
  };
};
