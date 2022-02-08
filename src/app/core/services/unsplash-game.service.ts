import { Injectable } from "@angular/core";
import { IHttpErrorResponse, parseHttpError, randomElementFromArray, randomizeArray, takeFromArray } from "@app/shared/common";
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
  reveal?: boolean; //shows the category
}
export interface IUnsplashGame {
  first: IUnsplashGameCategoryWithItems;
  second: IUnsplashGameCategoryWithItems;
  herrings: IUnsplashGameCategoryWithItems;
  done?: boolean;
}

export type UnsplashPhotoFilter = (photo: IGamePhoto) => boolean;
export interface IUnsplashGameConfig {
  first: IUnsplashGameCategory;
  second: IUnsplashGameCategory;
  herrings: UnsplashPhotoFilter
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

  buildGame(configOrIndex: IUnsplashGameConfig | number) {
    if (typeof(configOrIndex) === 'number') {
      const index = configOrIndex % gameRepo.length;
      configOrIndex = gameRepo[index];
    }
    return from(this._runWhenReady(() => true))
      .pipe(
        switchMap(_ => {
          return this._buildGame(configOrIndex as IUnsplashGameConfig);
        })
      )
  }

  resetGame(game: IUnsplashGame) {
    if (!game) { return; }
    
    //shuffle the items
    const items = randomizeArray([
      ...game.first.items,
      ...game.second.items,
      ...game.herrings.items
    ]);
    game.first.items = takeFromArray(items, UnsplashGameCategorySize, false /* not immutable */);
    game.second.items = takeFromArray(items, UnsplashGameCategorySize, false /* not immutable */);
    game.herrings.items = takeFromArray(items, UnsplashGameCategorySize, false /* not immutable */);
    game.done = false;
  }

  private _buildGame(config: IUnsplashGameConfig): Observable<IUnsplashGame> {
    //only is executed when status === 'READY'
    if (this.status === 'READY') {
      const ret: IUnsplashGame = {
        first: { ...config.first, items: [] },
        second: { ...config.second, items: [] },
        herrings: { category: UnsplashGameRedHerring, year: 0, items: []}
      };
      const a = this.bannapps.getAwardWinners(ret.first.category, ret.first.year);
      const b = this.bannapps.getAwardWinners(ret.second.category, ret.second.year);
      return forkJoin([a, b])
        .pipe(
          map(([first, second]: [IGameAwardPhoto[], IGameAwardPhoto[]]) => {
            ret.first.items = this.processCategoryItems(first.map(m => m.photo) as IGamePhoto[], ret.first.category);  
            ret.second.items = this.processCategoryItems(second.map(m => m.photo) as IGamePhoto[], ret.second.category);
            ret.herrings.items = this.processCategoryItems(this._randomHerrings(config.herrings) as IGamePhoto[], ret.herrings.category);

            //now shuffle the items
            this.resetGame(ret);            
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

  randomHerrings(filter: UnsplashPhotoFilter): Observable<IGamePhoto[]> {
    return from(this._runWhenReady(() => this._randomHerrings(filter)));
  }
  private _randomHerrings(filter: UnsplashPhotoFilter): IGamePhoto[] {
    //only is executed when status === 'READY'
    if (this.status === 'READY') {
      let herrings = (this.herrings as IGamePhoto[]).filter(filter);
      if (herrings.length < UnsplashGameCategorySize) {
        //warn and add some more
        console.warn("The herring photo filter was too restrictive.  Need to add more.", {count: herrings.length});
        let count = 0;
        while (herrings.length < UnsplashGameCategorySize && count < 100) { 
          count++; //count is used to keep from an infinite loop!!
          const item = randomElementFromArray(this.herrings as IGamePhoto[]);
          if (!!item?.id && herrings.every(m => m.id !== item.id)) {
            herrings = [
              ...herrings,
              item
            ];  
          }
        }
      }
      return takeFromArray(randomizeArray(herrings), UnsplashGameCategorySize)
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

const gameRepo: IUnsplashGameConfig[] = [
  {
    first: { category: 'Abstract', year: 2019 },
    second: { category: 'Interiors', year: 2020 },
    herrings: (photo: IGamePhoto) => {
      return !!photo.topics 
        && photo.topics?.every(m => !m.toLocaleLowerCase().includes('interior') 
                      && !m.toLocaleLowerCase().includes('abstract'));
    }    
  },
  {
    first: { category: 'Earth & Space', year: 2019 },
    second: { category: 'Fashion', year: 2020 },
    herrings: (photo: IGamePhoto) => {
      return !!photo.topics 
        && photo.topics?.every(m => !m.toLocaleLowerCase().includes('fashion') 
                      && !m.toLocaleLowerCase().includes('space'));
    }    
  },
  {
    first: { category: 'Food & Wellness', year: 2019 },
    second: { category: 'Architecture', year: 2020 },
    herrings: (photo: IGamePhoto) => {
      return !!photo.topics 
        && photo.topics?.every(m => !m.toLocaleLowerCase().includes('architecture') 
                      && !m.toLocaleLowerCase().includes('food'));
    }    
  },
  {
    first: { category: 'Nature', year: 2021 },
    second: { category: 'People', year: 2021 },
    herrings: (photo: IGamePhoto) => {
      return !!photo.topics 
        && photo.topics?.every(m => !m.toLocaleLowerCase().includes('nature') 
                      && !m.toLocaleLowerCase().includes('people'));
    }    
  },
  {
    first: { category: 'Food & Drink', year: 2021 },
    second: { category: 'Experimental', year: 2021 },
    herrings: (photo: IGamePhoto) => {
      return !!photo.topics 
        && photo.topics?.every(m => !m.toLocaleLowerCase().includes('food') 
                      && !m.toLocaleLowerCase().includes('experimental'));
    }    
  },
  {
    first: { category: 'Current Events', year: 2021 },
    second: { category: 'Interiors & Architecture', year: 2019 },
    herrings: (photo: IGamePhoto) => {
      return !!photo.topics 
        && photo.topics?.every(m => !m.toLocaleLowerCase().includes('architecture') 
                      && !m.toLocaleLowerCase().includes('current'));
    }    
  },
  {
    first: { category: 'Nature', year: 2020 },
    second: { category: 'Minimalism', year: 2019 },
    herrings: (photo: IGamePhoto) => {
      return !!photo.topics 
        && photo.topics?.every(m => !m.toLocaleLowerCase().includes('nature') 
                      && !m.toLocaleLowerCase().includes('minimalism'));
    }    
  },
  {
    first: { category: 'Fashion', year: 2020 },
    second: { category: 'Architecture & Interior', year: 2021 },
    herrings: (photo: IGamePhoto) => {
      return !!photo.topics 
        && photo.topics?.every(m => !m.toLocaleLowerCase().includes('architecture') 
                      && !m.toLocaleLowerCase().includes('fashion'));
    }    
  },
  {
    first: { category: 'Architecture', year: 2020 },
    second: { category: 'Food & Drink', year: 2021 },
    herrings: (photo: IGamePhoto) => {
      return !!photo.topics 
        && photo.topics?.every(m => !m.toLocaleLowerCase().includes('architecture') 
                      && !m.toLocaleLowerCase().includes('food'));
    }    
  },
  {
    first: { category: 'Current Events', year: 2019 },
    second: { category: 'Experimental', year: 2020 },
    herrings: (photo: IGamePhoto) => {
      return !!photo.topics 
        && photo.topics?.every(m => !m.toLocaleLowerCase().includes('current') 
                      && !m.toLocaleLowerCase().includes('experimental'));
    }    
  },
  {
    first: { category: 'Health & Wellness', year: 2021 },
    second: { category: 'Current Events', year: 2021 },
    herrings: (photo: IGamePhoto) => {
      return !!photo.topics 
        && photo.topics?.every(m => !m.toLocaleLowerCase().includes('health') 
                      && !m.toLocaleLowerCase().includes('current'));
    }    
  },
  {
    first: { category: 'Street Photography', year: 2021 },
    second: { category: 'Nature', year: 2020 },
    herrings: (photo: IGamePhoto) => {
      return !!photo.topics 
        && photo.topics?.every(m => !m.toLocaleLowerCase().includes('street') 
                      && !m.toLocaleLowerCase().includes('nature'));
    }    
  },
  {
    first: { category: 'Current Events', year: 2020 },
    second: { category: 'Interiors', year: 2020 },
    herrings: (photo: IGamePhoto) => {
      return !!photo.topics 
        && photo.topics?.every(m => !m.toLocaleLowerCase().includes('current') 
                      && !m.toLocaleLowerCase().includes('interior'));
    }    
  },
  {
    first: { category: 'Abstract', year: 2019 },
    second: { category: 'Fashion', year: 2021 },
    herrings: (photo: IGamePhoto) => {
      return !!photo.topics 
        && photo.topics?.every(m => !m.toLocaleLowerCase().includes('abstract') 
                      && !m.toLocaleLowerCase().includes('fashion'));
    }    
  },
];