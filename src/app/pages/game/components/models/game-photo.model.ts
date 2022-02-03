import { GamePhotographer, GamePhotoLocation } from ".";
import { IGamePhotoLocation } from "./game-photo-location.model"
import { IGamePhotographer } from "./game-photographer.model"

import { dateUtils, toList } from "@app/shared/common";
import * as dayjs from "dayjs";

export type PhotoSize = 'full' | 'regular' | 'small' | 'thumb';

export interface IGamePhoto {
  id?: string;
  date?: dayjs.Dayjs;
  width?: number;
  height?: number;
  alt?: string;
  color?: string;
  description?: string;
  location?: IGamePhotoLocation;
  tags?: string[];
  urls?: any;
  photographer?: IGamePhotographer;
  
  //url helpers as getters
  readonly urlFull?: string;
  readonly urlRegular?: string;
  readonly urlSmall?: string;
  readonly urlThumb?: string;

  getUrl?(size: PhotoSize, fallback: string): string;
};

export class GamePhoto implements IGamePhoto {
  id?: string;
  date?: dayjs.Dayjs;
  width?: number;
  height?: number;
  alt?: string;
  color?: string;
  description?: string;
  location?: IGamePhotoLocation;
  tags?: string[];
  urls?: any;
  photographer?: IGamePhotographer;

  //url helpers
  get urlFull(): string | undefined {
    return this.urls?.full;
  }
  get urlRegular(): string | undefined {
    return this.urls?.regular;
  }
  get urlSmall(): string | undefined {
    return this.urls?.small;
  }
  get urlThumb(): string | undefined {
    return this.urls?.thumb;
  }

  constructor(obj: any = null) {
    if (obj) {
      this.id = obj.id;

      this.date = dayjs(obj.date || obj.created_at || obj.updated_at);
      if (!dateUtils.isDayJs(this.date)) { this.date = undefined; }

      this.width = obj.width;
      this.height = obj.height;
      this.alt = obj.alt || obj.alt_description;
      this.color = obj.color;
      this.description = obj.description;
      if (obj.location) {
        this.location = new GamePhotoLocation(obj.location);
      }
      if (typeof(obj.tags) === 'string') {
        this.tags = toList(obj.tags).filter(Boolean) as string[];
      } else if (Array.isArray(obj.tags)) {
        this.tags = obj.tags
          .map((m: any) => `${m?.title || m}`.trim()).filter(Boolean);
      }
      if (typeof(obj.urls) === 'object') {
        this.urls = obj.urls;
      }
      if (obj.photographer || obj.user) {
        this.photographer = new GamePhotographer(obj.photographer || obj.user);
      }
    }
  }


  getUrl(size: PhotoSize, fallback: string): string {
    switch(size) {
      case 'full': return this.urlFull || fallback;
      case 'regular': return this.urlRegular || fallback;
      case 'small': return this.urlSmall || fallback;
      case 'thumb': return this.urlThumb || fallback;
    }
    //else
    return fallback;
  }
}
