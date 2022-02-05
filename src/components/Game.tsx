import './Game.scss';
import React from 'react';
import { GameType } from '../types';
import Cookies from 'universal-cookie';
import WordleService from '../services/WordleService';
import Board from './Board';

interface Props {
  gameType: GameType;
}

interface State {
  guesses: string[];
  loading: boolean;
}

export default class Game extends React.Component<Props, State> {
  cookies = new Cookies();

  constructor(props) {
    super(props);
    const guessesKey = `${props.gameType}#guesses`;
    const guesses = this.cookies.get(guessesKey);
    if (!guesses) {
      this.cookies.set(guessesKey, []);
    }
    this.state = {
      guesses: guesses ?? [],
      loading: true
    };
    WordleService.getWord(props.gameType).then(() => this.setState(() => ({ loading: true })));
  }

  render() {
    return this.state.loading ? this.renderContent() : this.renderSkeleton();
  }

  renderContent() {
    return (
      <div>
        <Board guesses={this.state.guesses} type={this.props.gameType} />
      </div>
    );
  }

  renderSkeleton() {
    return <div />;
  }
}
