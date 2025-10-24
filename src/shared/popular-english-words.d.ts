declare module "popular-english-words" {
  export interface Words {
    getMostPopular: (count: number) => string[];
    getMostPopularLength: (count: number, length: number) => string[];
    getMostPopularFilter: (
      count: number,
      test: (word: string) => boolean
    ) => string[];
    getMostPopularRegex: (count: number, regex: RegExp) => string[];
    getWordRank: (word: string) => number;
    getWordAtPosition: (position: number) => string;
    getWordCount: () => number;
    getAll: () => string[];
  };

  export const words: Words;
}
