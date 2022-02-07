import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable, Subscription } from 'rxjs';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from "@angular/cdk/drag-drop";

import { BannAppsUnsplashService, ToastService, IUnsplashGame, IUnsplashGameCategoryWithItems, UnsplashGameCategorySize, UnsplashGameService } from '@app/core/services';
import { IGamePhoto, IGamePhotographer } from '@app/shared/models';
import { httpErrorToString, parseHttpError, unsplashUrl } from '@app/shared/common';

export type GameMode = 'Novice' | 'Competent' | 'Pro';

@Component({
  selector: 'app-unsplash-home',
  templateUrl: './unsplash-home.component.html',
  styleUrls: ['./unsplash-home.component.css']
})
export class UnsplashHomeComponent implements OnInit, OnDestroy {
  private size: number = UnsplashGameCategorySize;
  gameId?: number;
  working$: Observable<boolean>;
  private subscriptions: Subscription[] = [];
  game$: Observable<IUnsplashGame>;
  selected: IGamePhoto | null = null;

  mode: GameMode = 'Pro';
  gameModes: GameMode[] = ['Novice', 'Competent', 'Pro'];
  showDetailedInstructions: boolean = false;
  categories: string[] = [];

  constructor(
    private bannapps: BannAppsUnsplashService,
    private gameService: UnsplashGameService,
    private toastr: ToastService,
    private route: ActivatedRoute
  ) { 
    this.working$ = bannapps.working$();
    this.game$ = gameService.buildGame(
      { category: '3D', year: 2021 },
      { category: 'Food & Drink', year: 2021 }
    );

    this.subscriptions.push(
      route.params.subscribe({
        next: (params) => {
          this.gameId = parseInt(params['game']);
          if (isNaN(this.gameId)) {
            //start with the first game
            this.gameId = 0;
          }
        }
      })
    )
  }

  changeMode(game: IUnsplashGame, mode: GameMode) {
    this.mode = mode;
    this.updateGame(game);
  }

  resetGame(game: IUnsplashGame) {
    //reshuffle the items
    this.gameService.resetGame(game);
    
    this.mode = 'Pro'; //reset the mode
    this.updateGame(game); //reset the columns based on the mode and reshuffled items
  }

  drop(event: CdkDragDrop<IGamePhoto[]>, game: IUnsplashGame) {
    if (game.done) { return; }

    //from https://material.angular.io/cdk/drag-drop/overview
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
    this.updateGame(game);
  }

  //debug: this is used to show a snapshot of a game
  showGame(game: IUnsplashGame) {
    return {
      first: {
        category: game.first.category,
        items: game.first.items.map(m => `${m.username} - ${m.category}`),
        done: game.first.done,
        reveal: game.first.reveal
      },
      second: {
        category: game.second.category,
        items: game.second.items.map(m => `${m.username} - ${m.category}`),
        done: game.second.done,
        reveal: game.second.reveal
      },
      herrings: {
        category: game.herrings.category,
        items: game.herrings.items.map(m => `${m.username} - ${m.category}`),
        done: game.herrings.done,
        reveal: game.herrings.reveal
      },
    }
  }

  private updateGame(game: IUnsplashGame) {
    //jump out!
    if (game.done) { return; }

    if (this.categories.length == 0) {
      //initialize if this the first attempt
      this.categories = [game.first.category, game.second.category]
    };

    this.checkColumnIsDone(
      game.first, 
      this.mode === 'Novice' ? this.categories[0] : undefined, 
      [this.mode === 'Novice' ? this.categories[1] : null, game.herrings.category]);
    this.checkColumnIsDone(
      game.second, 
      this.mode === 'Novice' ? this.categories[1] : undefined, 
      [this.mode === 'Novice' ? this.categories[0] : null, game.herrings.category]);
    this.checkColumnIsDone(
      game.herrings, 
      game.herrings.category, 
      this.categories);  //herring column must all be herrings

    game.first.reveal = this.calculateReveal(game, game.first);
    game.second.reveal = this.calculateReveal(game, game.second);
    game.herrings.reveal = this.calculateReveal(game, game.herrings);

    game.first.category = (game.first.reveal ? (this.mode === 'Novice' ? this.categories[0] : game.first.items[0].category) : null) || '';  
    game.second.category = (game.second.reveal ? (this.mode === 'Novice' ? this.categories[1] : game.second.items[0].category) : null) || '';  

    game.done = game.first.done && game.second.done && game.herrings.done;

  }
  private checkColumnIsDone(column: IUnsplashGameCategoryWithItems, category?: string, omit?: (string | null)[]) {
    omit = (omit || []).filter(Boolean);
    column.done = 
      column.items.length === this.size //must be the right size
      && column.items.every(m => m.category === (category || column.items[0].category))  //must all be of the same category
      && !column.items.some(m => omit?.includes(m.category || '')) //make sure no items are in the "omit" category array
  }
  private calculateReveal(game: IUnsplashGame, column: IUnsplashGameCategoryWithItems): boolean {
    return game.done === true
     || this.mode === 'Novice'
     || (this.mode === 'Competent' && column.done === true);
 }



  select(photo: IGamePhoto) {
    if (!photo) { return; }
    if (photo.photographer) { this.selected = photo; }
    //else
    this.bannapps.getPhotographerByUsername(photo.username as string)
      .subscribe({
        next: (result) => {
          photo.photographer = result as IGamePhotographer;
          this.selected = photo;
        },
        error: (err) => {
          const error = parseHttpError(err);
          console.warn("Error getting photographer", {photo, err, error});
          this.toastr.addAs('error', `Unable load photographer: ${httpErrorToString(error)}`);
        }
      })
  }


  get src(): string {
    if (this.selected && this.selected.urls) {
      const width = Math.floor(document.body.offsetWidth * .7);
      return  unsplashUrl(this.selected.urls, 'regular', true, width);
    }
    //else
    return '';
  }


  ngOnInit(): void {
  }

  ngOnDestroy(): void {
      if (this.subscriptions) {
        this.subscriptions.forEach(sub => sub.unsubscribe());
      }
  }

}

