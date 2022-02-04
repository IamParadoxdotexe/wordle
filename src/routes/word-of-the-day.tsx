import Board from '../components/Board';
import Cookies from 'universal-cookie';
import React from 'react';

export default class WordOfTheDay extends React.Component<{}, {}> {
  cookies = new Cookies();

  state = {
    guesses: this.cookies.get('guesses') ? this.cookies.get('guesses').split(' ') : []
  };

  render() {
    return (
      <div>
        <Board guesses={this.state.guesses} wordle='moist' />
      </div>
    );
  }
}
