import './Game.scss';
import React from 'react';
import { GameType, Letter } from '../types';
import Cookies from 'universal-cookie';
import WordleService from '../services/WordleService';
import Board from './Board';
import Keyboard from './Keyboard';

interface Props {
  gameType: GameType;
}

interface State {
  confirmedLetters: Letter[];
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

    this.state = {
      confirmedLetters: guesses ?? [],
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
        <Keyboard />
      </div>
    );
  }

  renderSkeleton() {
    return <div />;
  }
}
