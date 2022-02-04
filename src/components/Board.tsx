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
    words: [],
    wordle: 'those',
    guess: ''
  };

  keyHandler = e => {
    if (Alphabet[e.key]) {
      if (this.state.guess.length < 5) {
        this.setState(state => ({ guess: state.guess + e.key }));
      }
    } else if (e.key === 'Enter') {
      if (this.state.guess.length === 5) {
        WordleService.isLegalGuess(this.state.guess).then(legal => {
          if (legal) {
            this.setState(state => ({
              guess: '',
              words: state.words.concat([WordleService.evaluateGuess(state.guess, state.wordle)])
            }));
          }
        });
      }
    } else if (e.key === 'Backspace') {
      this.setState(state => ({ guess: state.guess.slice(0, -1) }));
    }
  };

  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    document.addEventListener('keydown', this.keyHandler, false);
    const words = [];
    for (const guess of ['salet', 'thief', 'shoes', 'these']) {
      words.push(await WordleService.evaluateGuess(guess, this.state.wordle));
    }
    this.setState(() => ({ words }));
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
