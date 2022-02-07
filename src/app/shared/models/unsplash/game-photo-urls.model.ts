export interface IGamePhotoUrls {
  raw?: string;
  full?: string;
  regular?: string;
  small?: string;
  small_s3?: string;
  thumb?: string;
}

export class GamePhotoUrls implements IGamePhotoUrls {
  raw?: string;
  full?: string;
  regular?: string;
  small?: string;
  small_s3?: string;
  thumb?: string;

  constructor(obj: any = null) {
    if (obj) {
      this.raw = obj.raw;
      this.full = obj.full;
      this.regular = obj.regular;
      this.small = obj.small;
      this.small_s3 = obj.small_s3;
      this.thumb = obj.thumb;  
    }
  }
}