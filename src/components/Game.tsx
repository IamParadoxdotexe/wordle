import './Game.scss';
import React from 'react';
import { GameType, Letter, LetterType } from '../types';
import Cookies from 'universal-cookie';
import WordleService from '../services/WordleService';
import Board from './Board';
import Keyboard from './Keyboard';
import { Delay } from '../util/Delay';
import { Alphabet } from '../globals';

interface Props {
  gameType: GameType;
}

interface State {
  confirmedLetters: Letter[];
  knownLetters: { [key: string]: LetterType };
  solved: boolean;
  guess: string;
}

export default class Game extends React.Component<Props, State> {
  cookies = new Cookies();
  processingGuess = false;

  constructor(props) {
    super(props);
    // get word from server
    WordleService.getWord(props.gameType).then();

    // get stored guesses
    const guessesKey = `${props.gameType}#guesses`;
    const guesses = this.cookies.get(guessesKey);
    if (!guesses) {
      this.cookies.set(guessesKey, []);
    }
    const confirmedLetters = (guesses ?? []) as Letter[];
    const solved =
      confirmedLetters.length >= 5 &&
      confirmedLetters.slice(-5).every(letter => letter.type === LetterType.CORRECT);

    this.state = {
      confirmedLetters,
      knownLetters: this.compileKnownLetters(confirmedLetters),
      solved,
      guess: ''
    };
  }

  async componentDidMount() {
    document.addEventListener('keydown', this.keyHandler, false);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.keyHandler, false);
  }

  keyHandler = async e => {
    if (!this.processingGuess && !this.state.solved) {
      // backspace or undo
      if (e.key === 'Backspace' || (e.ctrlKey && e.key === 'z')) {
        this.setState(state => ({ guess: state.guess.slice(0, -1) }));
      }
      // add letter
      else if (Alphabet[e.key] && !e.ctrlKey) {
        if (this.state.guess.length < 5) {
          this.setState(state => ({ guess: state.guess + e.key }));
        }
      }
      // submit guess
      else if (e.key === 'Enter') {
        // check if guess is valid
        this.processingGuess = true;
        if (this.state.guess.length < 5 || !(await WordleService.isValidGuess(this.state.guess))) {
          await this.shakeGuess();
        } else {
          await this.evaluateGuess(this.state.guess);
        }
        this.processingGuess = false;
      }
    }
  };

  /**
   * Compile and return known letter types for Keyboard.
   * @param confirmedLetters Confirmed letter objects
   */
  compileKnownLetters(confirmedLetters: Letter[]): { [key: string]: LetterType } {
    const knownLetters = {};
    for (const letter of confirmedLetters) {
      const currentLetterType = knownLetters[letter.value] ?? 'z';
      if (letter.type.localeCompare(currentLetterType) < 0) {
        knownLetters[letter.value] = letter.type;
      }
    }
    return knownLetters;
  }

  /**
   * Evaluates valid guess against server for correctness. Updates state over time for Board and Keyboard.
   * Checks for win and lose conditions.
   * @param guess valid, 5-letter guess string
   */
  async evaluateGuess(guess: string) {
    // evaluate guess against server
    const newLetters = await WordleService.evaluateGuess(guess, this.props.gameType);
    const confirmedLetters = this.state.confirmedLetters.concat(newLetters);

    // update state over time
    await this.addGuessOverTime(newLetters);

    // check if puzzle has been solved or failed
    const solved = newLetters.every(letter => letter.type === LetterType.CORRECT);
    const failed = confirmedLetters.length === 30;

    if (solved || failed) {
      await Delay(600);
      this.setState(() => ({ solved: true }));
      this.cookies.set(`${this.props.gameType}#solved`, true);

      // for Word Rush, acquire new word and clear game state
      if (this.props.gameType === GameType.WORD_RUSH) {
        await WordleService.getWord(this.props.gameType);
        this.setState(() => ({ confirmedLetters: [], knownLetters: {}, solved: false }));
      }
    }

    this.cookies.set(`${this.props.gameType}#guesses`, this.state.confirmedLetters);
  }

  /**
   * Adds new letters to state over time for animation purposes.
   * @param newLetters 5 newly-confirmed letter objects
   */
  async addGuessOverTime(newLetters: Letter[]) {
    for (let i = 0; i < 5; i++) {
      this.setState(state => {
        const confirmedLetters = state.confirmedLetters.concat([newLetters[i]]);
        return {
          confirmedLetters,
          knownLetters: this.compileKnownLetters(confirmedLetters),
          guess: state.guess.slice(1)
        };
      });
      if (i < 4) {
        await Delay(300);
      }
    }
  }

  /**
   * Shake invalid guess for user feedback.
   */
  async shakeGuess() {
    const shakeDuration = 450;
    const elements = Array.from(
      document.getElementsByClassName('unconfirmed') as HTMLCollectionOf<HTMLElement>
    );
    elements.forEach(element => {
      element.style.animation = `invalid-shake ${shakeDuration}ms`;
      Delay(shakeDuration).then(() => (element.style.animation = ''));
    });
    await Delay(shakeDuration);
  }

  render() {
    return (
      <div className='game'>
        <Board
          gameType={this.props.gameType}
          confirmedLetters={this.state.confirmedLetters}
          guess={this.state.guess}
          solved={this.state.solved}
        />
        <Keyboard knownLetters={this.state.knownLetters} />
      </div>
    );
  }
}
