import type { Game, Player } from "../shared/types";
import { getAllPoints } from "../shared/utilities";

export type PlayerStats = Player & {
  id: string;
  uniqueWords: string[];
  totalPoints: number;
  uniquePoints: number;
  longestUniqueWord: string;
};

export const generatePlayerStats = (game: Game) => {
  return Object.keys(game.players).map((playerId) => {
    const words = Object.keys(game.words)
      .map((w) => ({
        word: w,
        players: game.words[w],
      }))
      .filter((w) => w.players.includes(playerId));
    const uniqueWords = words
      .filter((w) => w.players.length === 1)
      .map((w) => w.word);

    return {
      ...game.players[playerId],
      uniqueWords,
      id: playerId,
      totalPoints: getAllPoints(
        words.map((w) => w.word),
        game.letters
      ),
      uniquePoints: getAllPoints(uniqueWords, game.letters),
      longestUniqueWord: uniqueWords.reduce(
        (longest, word) => (word.length > longest.length ? word : longest),
        ""
      ),
    };
  });
};
