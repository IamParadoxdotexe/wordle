import React from 'react';
import { GameType } from '../types';
import Game from '../components/Game';

export default class WordOfTheDay extends React.Component<{}, {}> {
  gameType = GameType.WORD_RUSH;

  render() {
    return <Game gameType={this.gameType} />;
  }
}
