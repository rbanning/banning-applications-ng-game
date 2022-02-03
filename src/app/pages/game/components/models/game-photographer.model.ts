export interface IGamePhotographer {
  id?: string;
  username?: string;
  name?: string;
  portfolio?: string;
  bio?: string;
  location?: string;

  readonly link?: string; //link to photographer

}

export class GamePhotographer implements IGamePhotographer {
  id?: string;
  username?: string;
  name?: string;
  portfolio?: string;
  bio?: string;
  location?: string;

  get link(): string | undefined {
    return !!this.username ? `https://unsplash.com/${this.username}` : undefined;
  }

  constructor(obj: any = null) {
    if (obj) {
      this.id = obj.id;
      this.username = obj.username;
      this.name = obj.name;
      this.portfolio = obj.portfolio;
      this.bio = obj.bio;
      this.location = obj.location;
    }
  }
}