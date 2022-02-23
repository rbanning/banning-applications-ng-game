import { IUser } from "../auth/user.model";
import { GameScore, IGameScore, IToGameScore } from "../score.model";
import { IGamePhoto } from "./game-photo.model";

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
export interface IUnsplashGame extends IToGameScore {
  first: IUnsplashGameCategoryWithItems;
  second: IUnsplashGameCategoryWithItems;
  herrings: IUnsplashGameCategoryWithItems;
  done?: boolean;
}

export const blankUnsplashGameCategoryWithItems: IUnsplashGameCategoryWithItems = {
  category: '',
  year: 0,
  items: [],
  done: false,
  reveal: false
};

export class UnsplashGame implements IUnsplashGame {
  first: IUnsplashGameCategoryWithItems = blankUnsplashGameCategoryWithItems;
  second: IUnsplashGameCategoryWithItems = blankUnsplashGameCategoryWithItems;
  herrings: IUnsplashGameCategoryWithItems = blankUnsplashGameCategoryWithItems;
  done?: boolean;

  constructor(obj: any = null) {
    if (obj) {
      this.first = obj.first || blankUnsplashGameCategoryWithItems;
      this.second = obj.second || blankUnsplashGameCategoryWithItems;
      this.herrings = obj.herrings || blankUnsplashGameCategoryWithItems;
      this.done = typeof(obj.done) === 'boolean' ? obj.done : undefined;
    }
  }

  toGameScore(user: string | IUser): IGameScore | null {
    if (this.done) {
      const email = (typeof(user) === 'string' ? user : user?.email) || 'unknown';
      const points = 1; //todo: points are not really important (or hae not been thought out)
      const description = `Successfully groups photos into the categories: ${this.first.category} [${this.first.year}] and ${this.second.category} [${this.second.year}]`; //todo: - build the description
      return GameScore.Create(email, points, description);
    }
    //else
    return null;
  }
}

export type UnsplashPhotoFilter = (photo: IGamePhoto) => boolean;
export interface IUnsplashGameConfig {
  first: IUnsplashGameCategory;
  second: IUnsplashGameCategory;
  herrings: UnsplashPhotoFilter
}
