import './Keyboard.scss';
import React from 'react';
import { LetterType } from '../types';
import { Qwerty } from '../globals';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

interface Props {
  knownLetters: { [key: string]: LetterType };
}

interface State {
  knownLetters: { [key: string]: LetterType };
}

export default class Keyboard extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      knownLetters: props.knownLetters
    };
  }

  async UNSAFE_componentWillReceiveProps(newProps: Props) {
    if (newProps.knownLetters !== this.state.knownLetters) {
      this.setState(() => ({
        knownLetters: newProps.knownLetters
      }));
    }
  }

  render() {
    return (
      <div className='keyboard'>
        <div className='keyboard__row'>{this.renderKeys(0, 10)}</div>
        <div className='keyboard__row'>{this.renderKeys(10, 19)}</div>
        <div className='keyboard__row'>{this.renderKeys(19, 26)}</div>
      </div>
    );
  }

  renderKeys(start, end) {
    return (
      <TransitionGroup className='keyboard__row'>
        {Qwerty.slice(start, end).map(letter => {
          const type = this.state.knownLetters[letter];
          return (
            <CSSTransition key={`${letter}-${type}`} timeout={300} classNames='key' exit={false}>
              <div className={`row__key ${type}`} key={letter}>
                {letter}
              </div>
            </CSSTransition>
          );
        })}
      </TransitionGroup>
    );
  }
}
