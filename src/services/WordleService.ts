import { Letter } from '../types';
import binarySearch from 'binary-search';
import { getWordList } from '../globals';

const api = 'https://api.wordle.thenjk.com';
const headers = { 'Content-Type': 'application/json' };

export default class WordleService {
  public static async evaluateGuess(guess: string, wordle: string): Promise<Letter[]> {
    const response = await fetch(`${api}/guess?guess=${guess}`, { method: 'POST', headers });
    return await response.json();
  }

  public static async isLegalGuess(guess: string): Promise<boolean> {
    const guessIndex = binarySearch(await getWordList(), guess, (x, y) => x.localeCompare(y));
    return guessIndex > -1;
  }
}
