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
    WordleService.getWord(props.gameType).then(() => this.setState(() => ({ loading: true })));

    // get stored guesses
    const guessesKey = `${props.gameType}#guesses`;
    const guesses = this.cookies.get(guessesKey);
    if (!guesses) {
      this.cookies.set(guessesKey, []);
    }
    const confirmedLetters = (guesses ?? []) as Letter[];

    // compile known letters
    const knownLetters = {};
    for (const letter of confirmedLetters) {
      const currentLetterType = knownLetters[letter.value] ?? 'z';
      if (letter.type.localeCompare(currentLetterType) < 0) {
        knownLetters[letter.value] = letter.type;
      }
    }

    this.state = {
      confirmedLetters,
      knownLetters,
      loading: true
    };
  }

  render() {
    return this.state.loading ? this.renderContent() : this.renderSkeleton();
  }

  renderContent() {
    return (
      <div className='game'>
        <Board confirmedLetters={this.state.confirmedLetters} gameType={this.props.gameType} />
        <Keyboard knownLetters={this.state.knownLetters} />
      </div>
    );
  }

  renderSkeleton() {
    return <div />;
  }
}
