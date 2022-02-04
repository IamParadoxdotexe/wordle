export enum Theme {
  LIGHT = 'light',
  DARK = 'dark'
}

export enum LetterType {
  WRONG = 'wrong',
  PARTIAL = 'partial',
  CORRECT = 'correct'
}

export interface Letter {
  value: string;
  type: LetterType;
}
