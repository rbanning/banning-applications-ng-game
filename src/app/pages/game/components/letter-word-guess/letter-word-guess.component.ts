import { Component, Input, OnInit } from '@angular/core';
import { IWordGuess } from '@app/shared/models';
import { LetterWordGameMode } from '../letter-word-game/letter-word-game.component';


@Component({
  selector: 'app-letter-word-guess',
  templateUrl: './letter-word-guess.component.html',
  styleUrls: ['./letter-word-guess.component.css']
})
export class LetterWordGuessComponent implements OnInit {
  @Input()
  guess?: IWordGuess;

  @Input()
  mode: LetterWordGameMode = 'basic';

  get letters(): string[] {
    return !!this.guess ? [...this.guess.guess] : [];
  }

  constructor() { }

  ngOnInit(): void {
  }

}
