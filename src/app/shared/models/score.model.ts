import { IUser } from "./auth/user.model";

export interface IGameScore {
  email: string;
  points: number;
  description: string;
}

//be sure to extend all game models from this interface so we can create a score
export interface IToGameScore {
  toGameScore?: (user: string | IUser) => IGameScore | null;
}

export class GameScore implements IGameScore {
  email: string = '';
  points: number = 0;
  description: string = '';

  constructor(obj: any = null) {
    if (obj) {
      this.email = obj.email;
      this.points = obj.points;
      this.description = obj.description;
    }
  }

  static Create(email: string, points: number, description: string) {
    var ret = new GameScore();
    ret.email = email;
    ret.points = points;
    ret.description = description;
    return ret;
  }

}