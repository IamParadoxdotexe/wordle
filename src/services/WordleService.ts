import { Letter, LetterType } from '../types';
import binarySearch from 'binary-search';
import { getWordList } from '../globals';

export default class WordleService {
  public static evaluateGuess(guess: string, wordle: string): Letter[] {
    const letters: Letter[] = [];

    // find CORRECT letters
    for (let i = 0; i < guess.length; i++) {
      letters.push({
        value: guess[i],
        type: LetterType.WRONG
      });

      if (guess[i] === wordle[i]) {
        letters[i].type = LetterType.CORRECT;
        wordle = this.replaceIndex(wordle, i, ' ');
      }
    }

    // find PARTIAL letters
    const wordleArray = wordle.split('');
    for (let i = 0; i < guess.length; i++) {
      if (letters[i].type !== LetterType.CORRECT) {
        const index = wordleArray.findIndex(c => c === guess[i]);
        if (index > -1) {
          letters[i].type = LetterType.PARTIAL;
          wordleArray.splice(index, 1);
        }
      }
    }

    return letters;
  }

  public static async isLegalGuess(guess: string): Promise<boolean> {
    const guessIndex = binarySearch(await getWordList(), guess, (x, y) => x.localeCompare(y));
    return guessIndex > -1;
  }

  private static replaceIndex(str: string, index: number, replacement: string) {
    return str.substring(0, index) + replacement + str.substring(index + replacement.length);
  }
}
