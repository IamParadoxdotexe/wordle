import Board from '../components/Board';
import Cookies from 'universal-cookie';
import React from 'react';
import { GameType } from '../types';
import WordleService from '../services/WordleService';

interface State {
  guesses: string[];
  loading: boolean;
}

export default class WordOfTheDay extends React.Component<{}, State> {
  cookies = new Cookies();
  gameType = GameType.WORD_OF_THE_DAY;

  constructor(props) {
    super(props);
    const guessesKey = `${this.gameType}#guesses`;
    const guesses = this.cookies.get(guessesKey);
    if (!guesses) {
      this.cookies.set(guessesKey, []);
    }
    this.state = {
      guesses: guesses ?? [],
      loading: true
    };
    WordleService.getWord(this.gameType).then(() => this.setState(() => ({ loading: true })));
  }

  render() {
    return this.state.loading ? this.renderContent() : this.renderSkeleton();
  }

  renderContent() {
    return (
      <div>
        <Board guesses={this.state.guesses} type={this.gameType} />
      </div>
    );
  }

  renderSkeleton() {
    return <div></div>;
  }
}
