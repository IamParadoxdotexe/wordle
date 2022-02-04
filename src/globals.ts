import wordListFile from './wordList.txt';

const alphabetArray = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z'
];
export const Alphabet = {};
for (const a of alphabetArray) {
  Alphabet[a] = true;
}

export let WordList = [];
fetch(wordListFile)
  .then(r => r.text())
  .then(text => {
    WordList = text.split('\r\n');
  });
