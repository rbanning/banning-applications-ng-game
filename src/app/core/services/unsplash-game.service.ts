import { Injectable } from "@angular/core";
import { IHttpErrorResponse, parseHttpError, randomizeArray, takeFromArray } from "@app/shared/common";
import { IGameAwardPhoto, IGamePhoto } from "@app/shared/models";
import { forkJoin, from, map, Observable, switchMap, throwError } from "rxjs";
import { BannAppsUnsplashService } from "./bannapps-unsplash.service";

export type UnsplashGameStatus = 'PENDING' | 'READY' | 'ERROR';
export const UnsplashGameCategorySize = 3;
export const UnsplashGameRedHerring = "Red Herring";

export interface IUnsplashGameCategory {
  category: string;
  year: number;
}
export interface IUnsplashGameCategoryWithItems extends IUnsplashGameCategory {
  items: IGamePhoto[];
  done?: boolean; //keeping this in to allow for easier mode
}
export interface IUnsplashGame {
  first: IUnsplashGameCategoryWithItems;
  second: IUnsplashGameCategoryWithItems;
  herrings: IUnsplashGameCategoryWithItems;
  done?: boolean;
}


@Injectable()
export class UnsplashGameService {
  private readonly RED_HERRING = 'Red Herring';
  private herrings: IGamePhoto[] | null = null;
  error: IHttpErrorResponse | null = null;



  get status(): UnsplashGameStatus {
    if (this.error) { return 'ERROR'; }
    else if (this.herrings) { return 'READY'; }
    //else
    return 'PENDING';
  }

  constructor(
    private bannapps: BannAppsUnsplashService
  ) {
    this.bannapps.getPhotosByTopic(this.RED_HERRING)
      .subscribe({
        next: (results) => this.herrings = results,
        error: (err) => this.error = parseHttpError(err)
      });
  }

  buildGame(category1: IUnsplashGameCategory, category2: IUnsplashGameCategory): Observable<IUnsplashGame> {
    return from(this._runWhenReady(() => true))
      .pipe(
        switchMap(_ => {
          return this._buildGame(category1, category2);
        })
      )
  }
  private _buildGame(category1: IUnsplashGameCategory, category2: IUnsplashGameCategory): Observable<IUnsplashGame> {
    //only is executed when status === 'READY'
    if (this.status === 'READY') {
      const ret: IUnsplashGame = {
        first: { ...category1, items: [] },
        second: { ...category2, items: [] },
        herrings: { category: UnsplashGameRedHerring, year: 0, items: []}
      };
      const a = this.bannapps.getAwardWinners(ret.first.category, ret.first.year);
      const b = this.bannapps.getAwardWinners(ret.second.category, ret.second.year);
      return forkJoin([a, b])
        .pipe(
          map(([first, second]: [IGameAwardPhoto[], IGameAwardPhoto[]]) => {
            ret.first.items = this.processCategoryItems(first.map(m => m.photo) as IGamePhoto[], ret.first.category);  
            ret.second.items = this.processCategoryItems(second.map(m => m.photo) as IGamePhoto[], ret.second.category);
            ret.herrings.items = this.processCategoryItems(this._randomHerrings() as IGamePhoto[], ret.herrings.category);

            //now shuffle the items
            const items = randomizeArray([
              ...ret.first.items,
              ...ret.second.items,
              ...ret.herrings.items
            ]);
            ret.first.items = takeFromArray(items, UnsplashGameCategorySize, false /* not immutable */);
            ret.second.items = takeFromArray(items, UnsplashGameCategorySize, false /* not immutable */);
            ret.herrings.items = takeFromArray(items, UnsplashGameCategorySize, false /* not immutable */);

            console.log("DEBUG the unsplash game", ret);  
            return ret;
          })
        );
    }

    //else
    return throwError(() => `Cannot execute. Status: ${this.status}`);
  }

  private processCategoryItems(photos: IGamePhoto[], category: string) {
    return takeFromArray(
      randomizeArray(
        photos.map(m => {
          return {
            ...m,
            category
          }
        })
      ), UnsplashGameCategorySize
    );
  }

  randomHerrings(count: number = UnsplashGameCategorySize): Observable<IGamePhoto[]> {
    return from(this._runWhenReady(() => this._randomHerrings(count)));
  }
  private _randomHerrings(count: number = UnsplashGameCategorySize): IGamePhoto[] {
    //only is executed when status === 'READY'
    if (this.status === 'READY') {
      return takeFromArray(randomizeArray(this.herrings as IGamePhoto[]), UnsplashGameCategorySize)
    }

    //else
    throw new Error(`Cannot execute. Status: ${this.status}`);
  }


  /// this service performs an initial GET for all of the red herring photos,
  /// thus, we cannot proceed with any other actions until this initial GET is complete.
  /// this helper method waits until the herrings are returned or there is an error
  private _runWhenReady<T>(action: () => T): Promise<T> {
    return new Promise((resolve, reject) => {
      //checkStatus will resolve/reject the promise based on status,
      //or if the status is PENDING, it will wait and try again
      const checkStatus = () => {
        switch (this.status) {
          case 'ERROR':
            reject(this.error);
            break;
          case 'READY': 
            resolve(action());
            break;

          case 'PENDING':
          default:
            setTimeout(() => checkStatus(), 500);
        }
      };
      checkStatus();  //kick it off
    });
  }
}