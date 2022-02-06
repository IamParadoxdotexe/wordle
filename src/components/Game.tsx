import './Game.scss';
import React from 'react';
import { GameType, Letter, LetterType } from '../types';
import Cookies from 'universal-cookie';
import WordleService from '../services/WordleService';
import Board from './Board';
import Keyboard from './Keyboard';
import { Delay } from '../util/Delay';

interface Props {
  gameType: GameType;
}

interface State {
  confirmedLetters: Letter[];
  knownLetters: { [key: string]: LetterType };
  loading: boolean;
  solved: boolean;
}

export default class Game extends React.Component<Props, State> {
  cookies = new Cookies();

  constructor(props) {
    super(props);
    // get word from server
    WordleService.getWord(props.gameType).then(() => this.setState(() => ({ loading: false })));

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
      loading: true,
      solved
    };
    this.validGuessHandler = this.validGuessHandler.bind(this);
  }

  // compile known letter types for Keyboard based on confirmedLetters
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

  // handler for updated guess letters emitted from Board
  async validGuessHandler(guess: string) {
    // evaluate guess against server
    const newLetters = await WordleService.evaluateGuess(guess, this.props.gameType);
    const confirmedLetters = this.state.confirmedLetters.concat(newLetters);

    // update state
    this.setState(() => ({
      confirmedLetters,
      knownLetters: this.compileKnownLetters(confirmedLetters),
      solved: false
    }));

    // check if puzzle has been solved or failed
    const solved = newLetters.every(letter => letter.type === LetterType.CORRECT);
    const failed = confirmedLetters.length === 30;

    if (solved || failed) {
      await Delay(2000);
      this.setState(() => ({ solved: true }));
      this.cookies.set(`${this.props.gameType}#solved`, true);

      if (this.props.gameType === GameType.WORD_RUSH) {
        await WordleService.getWord(this.props.gameType);
        this.setState(() => ({ confirmedLetters: [], knownLetters: {}, solved: false }));
      }
    }

    this.cookies.set(`${this.props.gameType}#guesses`, this.state.confirmedLetters);
  }

  render() {
    return this.state.loading ? this.renderSkeleton() : this.renderContent();
  }

  renderContent() {
    return (
      <div className='game'>
        <Board
          confirmedLetters={this.state.confirmedLetters}
          gameType={this.props.gameType}
          validGuessHandler={this.validGuessHandler}
          solved={this.state.solved}
        />
        <Keyboard knownLetters={this.state.knownLetters} />
      </div>
    );
  }

  renderSkeleton() {
    return <div />;
  }
}
