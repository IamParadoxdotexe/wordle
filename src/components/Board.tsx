import './Board.scss';
import React from 'react';
import WordleService from '../services/WordleService';
import { Alphabet } from '../globals';
import { Letter } from '../types';
import { Delay } from '../util/Delay';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

interface Props {
  guesses: string[];
  wordle: string;
}

interface State {
  letters: Letter[];
  wordle: string;
  guess: string;
  processingGuess: boolean;
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
      guess: '',
      processingGuess: false
    };
  }

  async componentDidMount() {
    document.addEventListener('keydown', this.keyHandler, false);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.keyHandler, false);
  }

  keyHandler = e => {
    if (!this.state.processingGuess) {
      if (Alphabet[e.key]) {
        if (this.state.guess.length < 5) {
          this.setState(state => ({ guess: state.guess + e.key }));
        }
      } else if (e.key === 'Enter') {
        // check if guess is legal
        if (this.state.guess.length === 5) {
          WordleService.isLegalGuess(this.state.guess).then(async legal => {
            if (legal) {
              // add new guess to board over time
              this.setState(() => ({ processingGuess: true }));
              const guessLetters = await WordleService.evaluateGuess(
                this.state.guess,
                this.state.wordle
              );
              for (let i = 0; i < guessLetters.length; i++) {
                this.setState(state => ({
                  letters: state.letters.concat([guessLetters[i]]),
                  guess: state.guess.slice(1),
                  processingGuess: i < guessLetters.length - 1
                }));
                await Delay(300);
              }
            }
          });
        }
      } else if (e.key === 'Backspace') {
        this.setState(state => ({ guess: state.guess.slice(0, -1) }));
      }
    }
  };

  render() {
    return (
      <TransitionGroup className='board'>
        {[...Array(30).keys()].map(i => {
          const letter = i < this.state.letters.length ? this.state.letters[i] : undefined;
          return (
            <CSSTransition
              key={letter ? `${i}-${letter}-${letter.type}` : i}
              timeout={300}
              classNames='tile'
              exit={false}
            >
              {() => {
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
              }}
            </CSSTransition>
          );
        })}
      </TransitionGroup>
    );
  }
}
