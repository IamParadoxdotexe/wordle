import './Board.scss';
import React from 'react';
import WordleService from '../services/WordleService';
import { Alphabet } from '../globals';
import { Letter, GameType } from '../types';
import { Delay } from '../util/Delay';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

interface Props {
  guesses: string[];
  type: GameType;
}

interface State {
  letters: Letter[];
  guess: string;
  processingGuess: boolean;
}

export default class Board extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    let letters = [];
    for (const guess of props.guesses) {
      letters = letters.concat(WordleService.evaluateGuess(guess, props.type));
    }
    this.state = {
      letters,
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
        // check if guess is valid
        if (this.state.guess.length === 5) {
          this.setState(() => ({ processingGuess: true }));
          WordleService.isValidGuess(this.state.guess).then(async legal => {
            if (legal) {
              // evaluate guess against server
              const guessLetters = await WordleService.evaluateGuess(
                this.state.guess,
                this.props.type
              );
              // add new confirmed guess letters to board over time
              for (let i = 0; i < guessLetters.length; i++) {
                this.setState(state => ({
                  letters: state.letters.concat([guessLetters[i]]),
                  guess: state.guess.slice(1),
                  processingGuess: i < guessLetters.length - 1
                }));
                await Delay(300);
              }
            } else {
              // shake unconfirmed guess letters
              const shakeDuration = 450;
              const elements = Array.from(
                document.getElementsByClassName('unconfirmed') as HTMLCollectionOf<HTMLElement>
              );
              elements.forEach(element => {
                element.style.animation = `invalid-shake ${shakeDuration}ms`;
                Delay(shakeDuration).then(() => (element.style.animation = ''));
              });
              Delay(shakeDuration).then(() => this.setState(() => ({ processingGuess: false })));
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
                // confirmed guess letters
                if (letter) {
                  return (
                    <div className={`board__tile ${letter.type}`} key={i}>
                      {letter.value}
                    </div>
                  );
                }
                // unconfirmed guess letters
                else if (i >= this.state.letters.length && i < this.state.letters.length + 5) {
                  return (
                    <div className='board__tile unconfirmed' key={i}>
                      {this.state.guess.padEnd(5)[i - this.state.letters.length]}
                    </div>
                  );
                }
                // empty tiles
                else {
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
