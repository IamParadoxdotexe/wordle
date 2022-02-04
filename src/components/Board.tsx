import './Board.scss';
import React from 'react';
import WordleService from '../services/WordleService';
import { Alphabet } from '../globals';
import { Letter } from '../types';

interface Props {
  guesses: string[];
  wordle: string;
}

interface State {
  letters: Letter[];
  wordle: string;
  guess: string;
}

export default class Board extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    let letters = [];
    for (const guess of props.guesses) {
      letters = letters.concat(WordleService.evaluateGuess(guess, props.wordle));
    }
    this.state = {
      letters,
      wordle: props.wordle,
      guess: ''
    };
  }

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
              letters: state.letters.concat(WordleService.evaluateGuess(state.guess, state.wordle)),
              guess: ''
            }));
          }
        });
      }
    } else if (e.key === 'Backspace') {
      this.setState(state => ({ guess: state.guess.slice(0, -1) }));
    }
  };

  async componentDidMount() {
    document.addEventListener('keydown', this.keyHandler, false);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.keyHandler, false);
  }

  render() {
    return (
      <div className='board'>
        {[...Array(30).keys()].map(i => {
          const letter = i < this.state.letters.length ? this.state.letters[i] : undefined;
          if (letter) {
            return (
              <div className={`board__tile ${letter.type}`} key={i}>
                {letter.value}
              </div>
            );
          } else if (i >= this.state.letters.length && i < this.state.letters.length + 5) {
            return (
              <div className='board__tile' key={i}>
                {this.state.guess.padEnd(5)[i - this.state.letters.length]}
              </div>
            );
          } else {
            return <div className='board__tile' key={i} />;
          }
        })}
      </div>
    );
  }
}
