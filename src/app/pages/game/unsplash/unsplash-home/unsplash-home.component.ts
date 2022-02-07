import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable, Subscription } from 'rxjs';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from "@angular/cdk/drag-drop";

import { BannAppsUnsplashService, IUnsplashGame, IUnsplashGameCategoryWithItems, UnsplashGameCategorySize, UnsplashGameService } from '@app/core/services';
import { IGamePhoto } from '@app/shared/models';

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
  
  constructor(
    private bannapps: BannAppsUnsplashService,
    private gameService: UnsplashGameService,
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

    this.checkColumnIsDone(game.first);
    this.checkColumnIsDone(game.second);
    this.checkColumnIsDone(game.herrings, game.herrings.category);  //herring column must all be herrings

    game.first.category = (game.first.done ? game.first.items[0].category : null) || '';  
    game.second.category = (game.second.done ? game.second.items[0].category : null) || '';  

    game.done = game.first.done && game.second.done && game.herrings.done;
  }

  showGame(game: IUnsplashGame) {
    return {
      first: {
        category: game.first.category,
        items: game.first.items.map(m => `${m.username} - ${m.category}`),
        done: game.first.done
      },
      second: {
        category: game.second.category,
        items: game.second.items.map(m => `${m.username} - ${m.category}`),
        done: game.second.done
      },
      herrings: {
        category: game.herrings.category,
        items: game.herrings.items.map(m => `${m.username} - ${m.category}`),
        done: game.herrings.done
      },
    }
  }

  checkColumnIsDone(column: IUnsplashGameCategoryWithItems, category?: string) {
    column.done = 
      column.items.length === this.size //must be the right size
      && column.items.every(m => m.category === (category || column.items[0].category));  //mush all be of the same category
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
      if (this.subscriptions) {
        this.subscriptions.forEach(sub => sub.unsubscribe());
      }
  }

}

