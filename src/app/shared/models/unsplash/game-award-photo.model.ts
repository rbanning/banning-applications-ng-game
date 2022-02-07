import { GamePhoto, IGamePhoto } from "./game-photo.model";

export interface IGameAwardCategory {
  year: number;
  category: string;
  count: number;
}

export interface IGameAwardPhoto {
  id?: string;
  photoId?: string;
  category?: string;
  year?: number;
  winner?: boolean;
  photo?: IGamePhoto
}

export class GameAwardPhoto implements IGameAwardPhoto {
  id?: string;
  photoId?: string;
  category?: string;
  year?: number;
  winner?: boolean;
  photo?: IGamePhoto

  constructor(obj: any = null) {
    if (obj) {
      this.id = obj.id;
      this.category = obj.category;
      this.year = obj.year;
      this.winner = obj.winner;
      this.photoId = obj.photoId;
      if (obj.photo && this.photoId === obj.photo.id) {
        this.photo = new GamePhoto(obj.photo);
      }
    }
  }
}