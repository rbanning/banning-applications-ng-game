//IMPORTANT: every word and guess
//           get passed through the wordNormalizeFn
//            before being evaluated.
//            As all checks for equality use ===,
//            differences in case will affect results.
//UPDATE THE FUNCTION BELOW TO MEET YOUR NEEDS
export const wordNormalizeFn = (word: string) => {
  return word.toLocaleUpperCase();
}

export type LetterGuessResult = 'correct' | 'near-miss' | 'wrong';

export interface ILetterGuess {
  letter: string;
  result: LetterGuessResult;
}

export type WordGuessError = 'WRONG LENGTH' | 'NOT IN LIST' | null;

export interface IWordGuess {
  guess: string;
  results: ILetterGuess[];

  //calculated
  readonly correct: boolean;
  readonly okCount: number;
  readonly error: string | null;

  //method
  setError(error: WordGuessError): IWordGuess;
}

export class WordGuess implements IWordGuess {
  guess: string = '';
  results: ILetterGuess[] = [];
  private _error: WordGuessError = null;

  //calculated
  get correct() {
    return this.results.length > 0
      && this.results.length === this.guess.length
      && this.results.every(m => m.result === 'correct');
  }
  get okCount() {
    return this.results
      .filter(m => m.result === 'correct' || m.result === 'near-miss')
      .length;
  }

  get error() {
    if (this._error) {
      switch (this._error) {
        case 'NOT IN LIST':
          return 'Guess was not in our dictionary of words';
        case 'WRONG LENGTH':
          return 'Guess was not the correct length';
        default:
          return 'Guess could not be checked'
      }
    }
    //else
    return null;
  }

  constructor(guess: string) {
    this.guess = wordNormalizeFn(guess);
  }

  checkAgainst(word: string): IWordGuess {
    this.results = WordGuess.Check(word, this.guess);
    if (this.results.length === 0) {
      //there was an error
      this._error = word.length === this.guess.length 
        ? 'NOT IN LIST'
        : 'WRONG LENGTH';
    }
    return this;
  }

  setError(message: WordGuessError): IWordGuess {
    this._error = message;
    return this;
  }

  static Check(word: string, guess: string): ILetterGuess[] {
    word = wordNormalizeFn(word);
    guess = wordNormalizeFn(guess);

    const ret: ILetterGuess[] = [];
    //only proceed if the words are of the same length
    if (word.length === guess.length) {
      for (let index = 0; index < guess.length; index++) {
        const char = guess[index];
        const letterGuess: ILetterGuess = {
          letter: char,
          result: 'wrong' //assume
        };
        if (word[index] === char) {
          letterGuess.result = 'correct';
        } else {
          const countInWord = [...word].filter(m => m === char).length;
          const countInGuesses = ret.map(m => m.letter).filter(m => m === char).length;
          if (countInWord > countInGuesses) {
            letterGuess.result = 'near-miss'
          }
        }
        ret.push(letterGuess);
      }
    }
    return ret;
  }
}

export interface ILetterWordGame {
  word: string;
  list: string[];
  guesses: IWordGuess[];
  
  //calculated
  readonly count: number;
  readonly last: IWordGuess | null;
  readonly done: boolean;

  //methods
  reset(): void;
  guess(word: string): IWordGuess;
  wordInList(word: string): boolean;
}

export class LetterWordGame implements ILetterWordGame {
  word: string = '';
  list: string[] = [];
  guesses: IWordGuess[] = [];

  //calculated
  get count() {
    return this.guesses.length;
  }
  get last() {
    return this.count === 0 ? null : this.guesses[this.count - 1];
  }
  get done() {
    return this.count > 0 && this.last?.correct === true;
  }

  constructor(word: string, list: string[]) {
    this.word = wordNormalizeFn(word);
    this.list = list.map(wordNormalizeFn);  //normalize
    this.reset();
  }

  reset() {
    this.guesses.length = 0;
  }

  guess(guess: string): IWordGuess {
    if (this.wordInList(guess)) {
      this.guesses.push(
        new WordGuess(guess).checkAgainst(this.word)
      );  
    } else {
      this.guesses.push(
        new WordGuess(guess).setError(this.word.length === guess.length ? 'NOT IN LIST' : 'WRONG LENGTH')  //don't check
      );
    }
    //we know there is at least one item so to make ts happy, we cast the result
    return this.last as WordGuess;
  }

  wordInList(word: string): boolean {
      return this.list.includes(wordNormalizeFn(word));
  }
}