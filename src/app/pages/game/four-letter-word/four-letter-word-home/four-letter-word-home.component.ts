import { Component, OnInit } from '@angular/core';

import { Observable, tap } from 'rxjs';

import { LetterWordGameService } from '@app/core/services';
import { ILetterWordGame } from '@app/shared/models';

@Component({
  selector: 'app-four-letter-word-home',
  templateUrl: './four-letter-word-home.component.html',
  styleUrls: ['../../x-letter-word-home.component.css']
})
export class FourLetterWordHomeComponent implements OnInit {
  showDetailedInstructions: boolean = false;
  game$?: Observable<ILetterWordGame | null>;
  winningGame: ILetterWordGame | null = null;

  constructor(
    private letterWordService: LetterWordGameService
  ) { 
    this.reset();
  }

  ngOnInit(): void {}

  reset() {
    this.winningGame = null;
    this.game$ = this.letterWordService.buildGame(4)
      .pipe(
        tap((game) => {
          console.log("DEBUG: the game", game);
        })
      );
  }

  setWinner(game: ILetterWordGame) {
    this.winningGame = game;
  }

}
