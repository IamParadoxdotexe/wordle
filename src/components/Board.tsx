import './Board.scss';
import React from 'react';
import WordleService from '../services/WordleService';
import { Alphabet } from '../globals';
import { GameType, Letter } from '../types';
import { Delay } from '../util/Delay';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

interface Props {
  confirmedLetters: Letter[];
  gameType: GameType;
  validGuessHandler: (guess: string) => void;
  solved: boolean;
}

interface State {
  confirmedLetters: Letter[];
  guess: string;
  processingGuess: boolean;
}

export default class Board extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      confirmedLetters: props.confirmedLetters,
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

  async UNSAFE_componentWillReceiveProps(newProps: Props) {
    if (newProps.confirmedLetters.length !== this.state.confirmedLetters.length) {
      const newLetters = newProps.confirmedLetters.slice(-5);
      // add new confirmed guess letters to board over time
      if (newLetters.length === 5) {
        for (let i = 0; i < 5; i++) {
          this.setState(state => ({
            confirmedLetters: state.confirmedLetters.concat([newLetters[i]]),
            guess: state.guess.slice(1),
            processingGuess: i < newLetters.length - 1
          }));
          if (i < 4) {
            await Delay(300);
          }
        }
      } else {
        this.setState(() => ({
          confirmedLetters: newProps.confirmedLetters,
          guess: '',
          processingGuess: false
        }));
      }
    }
  }

  keyHandler = e => {
    if (!this.state.processingGuess && !this.props.solved) {
      // backspace or undo
      if (e.key === 'Backspace' || (e.ctrlKey && e.key === 'z')) {
        this.setState(state => ({ guess: state.guess.slice(0, -1) }));
      }
      // add letter
      else if (Alphabet[e.key] && !e.ctrlKey) {
        if (this.state.guess.length < 5) {
          this.setState(state => ({ guess: state.guess + e.key }));
        }
      }
      // submit guess
      else if (e.key === 'Enter') {
        // check if guess is valid
        if (this.state.guess.length === 5) {
          this.setState(() => ({ processingGuess: true }));
          WordleService.isValidGuess(this.state.guess).then(async legal => {
            if (legal) {
              this.props.validGuessHandler(this.state.guess);
            } else {
              this.shakeGuess().then(() => this.setState(() => ({ processingGuess: false })));
            }
          });
        }
      }
    }
  };

  async shakeGuess() {
    const shakeDuration = 450;
    const elements = Array.from(
      document.getElementsByClassName('unconfirmed') as HTMLCollectionOf<HTMLElement>
    );
    elements.forEach(element => {
      element.style.animation = `invalid-shake ${shakeDuration}ms`;
      Delay(shakeDuration).then(() => (element.style.animation = ''));
    });
    await Delay(shakeDuration);
  }

  render() {
    return (
      <TransitionGroup className='board'>
        {[...Array(30).keys()].map(i => {
          const letter =
            i < this.state.confirmedLetters.length ? this.state.confirmedLetters[i] : undefined;
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
                else if (
                  i >= this.state.confirmedLetters.length &&
                  i < this.state.confirmedLetters.length + 5
                ) {
                  return (
                    <div className='board__tile unconfirmed' key={i}>
                      {this.state.guess.padEnd(5)[i - this.state.confirmedLetters.length]}
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
