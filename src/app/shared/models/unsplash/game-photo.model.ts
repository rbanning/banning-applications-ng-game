import { GamePhotographer, GamePhotoLocation } from ".";
import { IGamePhotoLocation } from "./game-photo-location.model"
import { IGamePhotographer } from "./game-photographer.model"

import { dateUtils, toList } from "@app/shared/common";
import * as dayjs from "dayjs";
import { GamePhotoUrls, IGamePhotoUrls } from "./game-photo-urls.model";

export type PhotoSize = 'full' | 'regular' | 'small' | 'thumb';

export interface IGamePhoto {
  id?: string;
  username?: string;
  published?: dayjs.Dayjs;
  width?: number;
  height?: number;
  alt?: string;
  color?: string;
  description?: string;
  blurHash?: string;
  location?: IGamePhotoLocation;
  tags?: string[];
  topics?: string[];
  urls?: IGamePhotoUrls;
  photographer?: IGamePhotographer;
  
  category?: string;  //this is not supplied by the db but is used in the app

  getUrl(size: PhotoSize, fallback: string): string;
};

export class GamePhoto implements IGamePhoto {
  id?: string;
  username?: string;
  published?: dayjs.Dayjs;
  width?: number;
  height?: number;
  alt?: string;
  color?: string;
  description?: string;
  blurHash?: string;
  location?: IGamePhotoLocation;
  tags?: string[];
  topics?: string[];
  urls?: IGamePhotoUrls;
  photographer?: IGamePhotographer;

  category?: string;  //this is not supplied by the db but is used in the app

  constructor(obj: any = null) {
    if (obj) {
      this.id = obj.id;

      this.published = dayjs(obj.published || obj.date || obj.created_at || obj.updated_at);
      if (!dateUtils.isDayJs(this.published)) { this.published = undefined; }

      this.width = obj.width;
      this.height = obj.height;
      this.alt = obj.alt || obj.altDescription || obj.alt_description;
      this.color = obj.color;
      this.description = obj.description;
      this.blurHash = obj.blurHash || obj.blur_hash;

      this.category = obj.category;   //this is not supplied by the db but might be in a serialized object

      //location
      if (obj.location) {
        this.location = new GamePhotoLocation(obj.location);
      }
      //tags
      if (typeof(obj.tags) === 'string') {
        this.tags = toList(obj.tags).filter(Boolean) as string[];
      } else if (Array.isArray(obj.tags)) {
        this.tags = obj.tags
          .map((m: any) => `${m?.title || m}`.trim()).filter(Boolean);
      }
      //topics
      if (typeof(obj.topics) === 'string') {
        this.topics = toList(obj.topics).filter(Boolean) as string[];
      } else if (Array.isArray(obj.topics)) {
        this.topics = obj.topics
          .map((m: any) => `${m?.title || m}`.trim()).filter(Boolean);
      }


      if (typeof(obj.urls) === 'object') {
        this.urls = new GamePhotoUrls(obj.urls);
      }

      if (obj.photographer || obj.user) {
        this.photographer = new GamePhotographer(obj.photographer || obj.user);
      }
      this.username = obj.username || obj.userName || this.photographer?.username;
    }
  }


  getUrl(size: PhotoSize, fallback: string): string {
    if (this.urls) {
      return this.urls[size] || fallback;
    }
    //else
    return fallback;
  }
}
