import { Component, OnInit } from '@angular/core';

import { LetterWordGameService } from '@app/core/services';
import { ILetterWordGame } from '@app/shared/models';
import { Observable, tap } from 'rxjs';

@Component({
  selector: 'app-three-letter-word-home',
  templateUrl: './three-letter-word-home.component.html',
  styleUrls: ['./three-letter-word-home.component.css']
})
export class ThreeLetterWordHomeComponent implements OnInit {
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
    this.game$ = this.letterWordService.buildGame(3)
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
