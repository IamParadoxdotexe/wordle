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

export const Qwerty = [
  'q',
  'w',
  'e',
  'r',
  't',
  'y',
  'u',
  'i',
  'o',
  'p',
  'a',
  's',
  'd',
  'f',
  'g',
  'h',
  'j',
  'k',
  'l',
  'z',
  'x',
  'c',
  'v',
  'b',
  'n',
  'm'
];

let wordList = [];
export const getWordList = async () => {
  if (wordList.length === 0) {
    const raw = await fetch(wordListFile);
    const text = await raw.text();
    wordList = text.split('\r\n');
  }
  return wordList;
};
