import './Board.scss';
import React from 'react';
import WordleService from '../services/WordleService';
import { Alphabet } from '../globals';
import { Word } from '../types';

interface State {
  words: Word[];
  wordle: string;
  guess: string;
}

export default class Board extends React.Component<{}, State> {
  state = {
    words: ['salet', 'thief', 'shoes', 'these'].map(guess =>
      WordleService.evaluateGuess(guess, 'those')
    ),
    wordle: 'those',
    guess: ''
  };
  keyHandler = e => {
    if (Alphabet[e.key]) {
      this.setState(state => ({ guess: state.guess + e.key }));
    } else if (e.key === 'Enter') {
      this.setState(() => ({ guess: '' }));
    } else if (e.key === 'Backspace') {
      this.setState(state => ({ guess: state.guess.slice(0, -1) }));
    }
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    document.addEventListener('keydown', this.keyHandler, false);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.keyHandler, false);
  }

  render() {
    return (
      <div className='board'>
        {[...Array(6).keys()].map((_z, i) => {
          const word = i < this.state.words.length ? this.state.words[i] : undefined;
          if (word) {
            return word.letters.map((letter, i) => (
              <div className={`board__tile ${letter.type}`} key={i}>
                {letter.value}
              </div>
            ));
          } else if (i === this.state.words.length) {
            return this.state.guess
              .padEnd(5)
              .split('')
              .map((letter, i) => (
                <div className='board__tile' key={i}>
                  {letter}
                </div>
              ));
          } else {
            return [...Array(5).keys()].map((_z, i) => <div className='board__tile' key={i} />);
          }
        })}
      </div>
    );
  }
}
