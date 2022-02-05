import './Keyboard.scss';
import React from 'react';
import { LetterType } from '../types';

interface Props {
  knownLetters: { [key: string]: LetterType };
}

export default class Keyboard extends React.Component<Props, {}> {
  constructor(props) {
    super(props);
  }

  render() {
    return <div />;
  }
}
