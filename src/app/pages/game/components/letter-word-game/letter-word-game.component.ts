import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ILetterWordGame, IWordGuess, wordNormalizeFn } from '@app/shared/models';

export type LetterWordGameMode = 'basic' | 'verbose';

@Component({
  selector: 'app-letter-word-game',
  templateUrl: './letter-word-game.component.html',
  styleUrls: ['./letter-word-game.component.css']
})
export class LetterWordGameComponent implements OnInit {
  @Input()
  game?: ILetterWordGame;

  @Input()
  mode: LetterWordGameMode = 'basic';

  @Output()
  winner = new EventEmitter<ILetterWordGame>();

  get guesses(): IWordGuess[] {
    return [
      ...(this.game?.guesses || [])
    ];
  }

  constructor() { }

  ngOnInit(): void {
  }

  guess(input: HTMLInputElement) {
    if (!input.value) { return; } //jump out if their is not input

    if (this.game) {
      this.game.guess(input.value);
      input.value = '';
      if (this.game.done) {
        this.winner.emit(this.game);
      } else {
        input.focus();
      }
    }
  }
 
  normalize(evt: KeyboardEvent) {
    const max = this.game?.word?.length || 0;
    const target = evt.target as HTMLInputElement;
    const char = evt.key;

    if (evt.code.toLocaleUpperCase() === 'ENTER') {
      evt.preventDefault(); 
      this.guess(target);
    } else if (evt.code.toLocaleUpperCase() === 'ESC') {
      evt.preventDefault(); 
      target.value = ''
    } else if (char.length === 1) {
      evt.preventDefault(); 
      if (target.value.length < max && (/[a-zA-Z]/).test(char)) {
        target.value += wordNormalizeFn(char);  
      }
    }
  }

}
