import './Board.scss';
import React from 'react';
import { GameType, Letter } from '../types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

interface Props {
  gameType: GameType;
  confirmedLetters: Letter[];
  guess: string;
  solved: boolean;
}

interface State {
  confirmedLetters: Letter[];
  guess: string;
  solved: boolean;
}

export default class Board extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      confirmedLetters: props.confirmedLetters,
      guess: props.guess,
      solved: props.solved
    };
  }

  async UNSAFE_componentWillReceiveProps(newProps: Props) {
    this.setState(() => ({
      confirmedLetters: newProps.confirmedLetters,
      guess: newProps.guess,
      solved: newProps.solved
    }));
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
