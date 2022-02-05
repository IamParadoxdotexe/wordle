import './Board.scss';
import React from 'react';
import WordleService from '../services/WordleService';
import { Alphabet } from '../globals';
import { GameType, Letter, LetterType } from '../types';
import { Delay } from '../util/Delay';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Cookies from 'universal-cookie';

interface Props {
  confirmedLetters: Letter[];
  gameType: GameType;
  guessHandler: (confirmedLetters: Letter[], solved: boolean, filled: boolean) => void;
}

interface State {
  confirmedLetters: Letter[];
  guess: string;
  processingGuess: boolean;
}

export default class Board extends React.Component<Props, State> {
  cookies = new Cookies();
  solved = false;

  constructor(props: Props) {
    super(props);
    this.solved =
      props.confirmedLetters.length >= 5 &&
      props.confirmedLetters.slice(-5).every(letter => letter.type === LetterType.CORRECT);
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

  keyHandler = e => {
    if (!this.state.processingGuess && !this.solved) {
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
                this.props.gameType
              );
              // add new confirmed guess letters to board over time
              for (let i = 0; i < guessLetters.length; i++) {
                this.setState(state => ({
                  confirmedLetters: state.confirmedLetters.concat([guessLetters[i]]),
                  guess: state.guess.slice(1),
                  processingGuess: i < guessLetters.length - 1
                }));
                await Delay(300);
              }
              // check if game is solved or board is filled
              this.checkBoardState();
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

  checkBoardState() {
    const solved = this.state.confirmedLetters
      .slice(-5)
      .every(letter => letter.type === LetterType.CORRECT);
    const filled = this.state.confirmedLetters.length === 30;
    this.props.guessHandler(this.state.confirmedLetters, solved, filled);

    if (solved || filled) {
      if (this.props.gameType === GameType.WORD_RUSH) {
        // reset board
        this.setState(() => ({
          confirmedLetters: [],
          guess: ''
        }));
        this.cookies.set(`${this.props.gameType}#guesses`, []);
      } else {
        this.cookies.set(`${this.props.gameType}#guesses`, this.state.confirmedLetters);
        this.solved = true;
      }
    } else {
      this.cookies.set(`${this.props.gameType}#guesses`, this.state.confirmedLetters);
    }
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
