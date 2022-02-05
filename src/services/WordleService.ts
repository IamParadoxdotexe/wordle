import { Letter, GameType } from '../types';
import binarySearch from 'binary-search';
import { getWordList } from '../globals';
import Cookies from 'universal-cookie';

const api = 'https://api.wordle.thenjk.com';
const headers = { 'Content-Type': 'application/json' };
const cookies = new Cookies();

export default class WordleService {
  public static async getWord(type: GameType): Promise<void> {
    const solved = cookies.get(`${type}#solved`);
    if (solved == undefined || JSON.parse(solved)) {
      await fetch(`${api}/word?type=${type}`, { credentials: 'include' });
      cookies.set(`${type}#solved`, 'false');
    }
  }

  public static async evaluateGuess(guess: string, type: GameType): Promise<Letter[]> {
    const response = await fetch(`${api}/guess?guess=${guess}&type=${type}`, {
      method: 'POST',
      headers,
      credentials: 'include'
    });
    return await response.json();
  }

  public static async isLegalGuess(guess: string): Promise<boolean> {
    const guessIndex = binarySearch(await getWordList(), guess, (x, y) => x.localeCompare(y));
    return guessIndex > -1;
  }
}
