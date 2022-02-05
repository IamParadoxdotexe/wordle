import './Game.scss';
import React from 'react';
import { GameType, Letter, LetterType } from '../types';
import Cookies from 'universal-cookie';
import WordleService from '../services/WordleService';
import Board from './Board';
import Keyboard from './Keyboard';

interface Props {
  gameType: GameType;
}

interface State {
  confirmedLetters: Letter[];
  knownLetters: { [key: string]: LetterType };
  loading: boolean;
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

    this.state = {
      confirmedLetters,
      knownLetters: this.compileKnownLetters(confirmedLetters),
      loading: true
    };
    this.guessHandler = this.guessHandler.bind(this);
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

  // handler for new guess letters emitted from Board
  guessHandler(guessLetters: Letter[]) {
    const solved = guessLetters.every(letter => letter.type === LetterType.CORRECT);

    if (solved) {
      this.setState(() => ({
        confirmedLetters: [],
        knownLetters: {}
      }));
      this.cookies.set(`${this.props.gameType}#solved`, true);
      WordleService.getWord(this.props.gameType).then(() =>
        this.setState(() => ({ loading: false }))
      );
    } else {
      this.setState(state => ({
        knownLetters: this.compileKnownLetters(state.confirmedLetters.concat(guessLetters))
      }));
    }
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
          guessHandler={this.guessHandler}
        />
        <Keyboard knownLetters={this.state.knownLetters} />
      </div>
    );
  }

  renderSkeleton() {
    return <div />;
  }
}
