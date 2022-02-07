export interface IGamePhotoLocation {
  city?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
}

export class GamePhotoLocation implements IGamePhotoLocation {
  city?: string;
  country?: string;
  latitude?: number;
  longitude?: number;

  constructor(obj: any = null) {
    if (obj) {
      this.city = obj.city;
      this.country = obj.country;
      this.latitude = obj.latitude || obj.position?.latitude;
      this.longitude = obj.longitude || obj.position?.longitude;
    }
  }
}