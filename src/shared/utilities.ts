import { wordlist } from "./wordlist";

/**
 * Gets a random word
 *
 * @param obscurityLevel The ranking of the least popular word to include
 * @param numberOfLetters How many unique letters in the word
 * @returns One random word that meets the conditions
 */
export const getRandomWord = (
  obscurityLevel: number = 10000,
  numberOfLetters: number = 0
) => {
  if (obscurityLevel > wordlist.length) return "ERROR";
  if (numberOfLetters === 0)
    return wordlist[Math.floor(Math.random() * obscurityLevel)];
  else {
    const possiblities = wordlist.filter(
      (word, index) =>
        index <= obscurityLevel &&
        getUniqueLetters(word).length === numberOfLetters
    );
    return possiblities[Math.floor(Math.random() * possiblities.length)];
  }
};

/**
 * Generate all the words that can be formed with the given letters
 *
 * @param letters The letters to make words with
 * @param obscurityLevel The ranking of the least popular word to include
 * @param minLength The smallest word length to include
 * @returns List of all possible words
 */
export const getAllWords = (
  letters: string[],
  obscurityLevel: number,
  minLength: number
) =>
  wordlist.filter(
    (word, index) =>
      index <= obscurityLevel &&
      word.length >= minLength &&
      word.split("").every((l) => letters.includes(l))
  );

/**
 * Get the unique letters in a word
 *
 * @param word The word to check
 * @returns An array of letters
 */
export const getUniqueLetters = (word: string) =>
  word.split("").filter((letter, index) => word.indexOf(letter) === index);

/**
 * Check if a word is included in the list of words above the obscurity level
 * @param word The word to check
 * @param obscurityLevel The ranking of the list popular word to include
 * @returns whether or not the word appears in the list
 */
export const isValidWord = (word: string, obscurityLevel: number) => {
  const rank = wordlist.indexOf(word);
  return rank !== -1 && rank <= obscurityLevel;
};

/**
 * A non-mutating shuffling algorithm modified from:
 * https://stackoverflow.com/a/2450976
 *
 * @param array The array to shuffle
 * @returns A shuffled copy of the array
 */
export const toShuffle = (array: any[]) => {
  const arrayCopy = [...array];
  let currentIndex = arrayCopy.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [arrayCopy[currentIndex], arrayCopy[randomIndex]] = [
      arrayCopy[randomIndex],
      arrayCopy[currentIndex],
    ];
  }

  return arrayCopy;
};

const POINTS_BY_LENGTH: { [index: number]: number } = {
  3: 1,
  4: 1,
  5: 2,
  6: 3,
  7: 5,
  8: 11,
  9: 11,
  10: 12,
  11: 12,
  12: 13,
};
const PANGRAM_POINTS = 7;

export const getPoints = (word: string, letters: string[]) => {
  let points = word.length < 13 ? POINTS_BY_LENGTH[word.length] : word.length;
  if (letters.every((l) => word.includes(l))) points += PANGRAM_POINTS;
  return points;
};

export const getAllPoints = (words: string[], letters: string[]) =>
  words.reduce((total, word) => total + getPoints(word, letters), 0);
