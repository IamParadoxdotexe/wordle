import './Keyboard.scss';
import React from 'react';
import { LetterType } from '../types';
import { Qwerty } from '../globals';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { ReactComponent as BackspaceIcon } from 'assets/icons/Backspace-Icon.svg';

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

  pressKey(key: string) {
    document.dispatchEvent(new KeyboardEvent('keydown', { key, ctrlKey: false }));
  }

  render() {
    return (
      <div className='keyboard'>
        <div className='keyboard__row'>{this.renderKeys(0, 10)}</div>
        <div className='keyboard__row'>{this.renderKeys(10, 19)}</div>
        <div className='keyboard__row'>
          <button className='keyboard__key wide hidden' tabIndex={-1} />
          {this.renderKeys(19, 26)}
          <button className='keyboard__key wide' onClick={() => this.pressKey('Backspace')}>
            <BackspaceIcon />
          </button>
        </div>
        <button className='keyboard__key submit' onClick={() => this.pressKey('Enter')}>
          SUBMIT
        </button>
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
              <button
                className={`keyboard__key ${type}`}
                key={letter}
                onClick={() => this.pressKey(letter)}
              >
                {letter}
              </button>
            </CSSTransition>
          );
        })}
      </TransitionGroup>
    );
  }
}
