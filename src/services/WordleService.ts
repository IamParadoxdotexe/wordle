import { LetterType, Word } from '../types';

export default class WordleService {
  public static evaluateGuess(guess: string, wordle: string): Word {
    const word: Word = { letters: [] };

    // find CORRECT letters
    for (let i = 0; i < guess.length; i++) {
      word.letters.push({
        value: guess[i],
        type: LetterType.WRONG
      });

      if (guess[i] === wordle[i]) {
        word.letters[i].type = LetterType.CORRECT;
        wordle = this.replaceIndex(wordle, i, ' ');
      }
    }

    // find PARTIAL letters
    const wordleArray = wordle.split('');
    for (let i = 0; i < guess.length; i++) {
      if (word.letters[i].type !== LetterType.CORRECT) {
        const index = wordleArray.findIndex(c => c === guess[i]);
        if (index > -1) {
          word.letters[i].type = LetterType.PARTIAL;
          wordleArray.splice(index, 1);
        }
      }
    }

    return word;
  }

  private static replaceIndex(str: string, index: number, replacement: string) {
    return str.substring(0, index) + replacement + str.substring(index + replacement.length);
  }
}
