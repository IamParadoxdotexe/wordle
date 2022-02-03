import './Board.scss';
import { useState } from 'react';
import WordleService from '../services/WordleService';

export default function Board() {
  const wordle = 'those';
  const [words] = useState(
    ['salet', 'thief', 'shoes', 'these', 'those'].map(guess =>
      WordleService.evaluateGuess(guess, wordle)
    )
  );

  return (
    <div className='board'>
      {[...Array(6).keys()].map((_z, i) => {
        const word = i < words.length ? words[i] : undefined;
        if (word) {
          return word.letters.map((letter, i) => (
            <div className={`board__tile ${letter.type}`} key={i}>
              {letter.value}
            </div>
          ));
        } else {
          return [...Array(5).keys()].map((_z, i) => <div className='board__tile' key={i} />);
        }
      })}
    </div>
  );
}
