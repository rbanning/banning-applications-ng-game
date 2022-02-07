import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { catchError, finalize, map, Observable, of, switchMap } from "rxjs";

import { ConfigService } from "./config.service";
import { GamePhoto, GamePhotographer, IGameAwardCategory, IConfig, IGamePhoto, IGamePhotographer, IPatchDto, WorkingHttpService, GameAwardPhoto, IGameAwardPhoto } from "@app/shared/models";
import { parseHttpError } from "@app/shared/common";

@Injectable()
export class BannAppsUnsplashService extends WorkingHttpService {
  private config: IConfig;

  constructor(
    private configService: ConfigService,
    private http: HttpClient
  ) {
    super();
    this.config = configService.getAll();
    this.BASE_URL = (this.config.os_url || '') + "unsplash/";
  }

  //#region >>> PHOTOGRAPHER <<<

  getPhotographerById(id: string, nullIfNotFound?: boolean): Observable<IGamePhotographer | null> {
    const url = this.buildUrl(['photographers', encodeURI(id)]);
    return this.http.get(url)
      .pipe(
        map((result: any) => new GamePhotographer(result)),
        catchError((err) => {
          const httpError = parseHttpError(err);
          console.log("getPhotographer", {err, httpError});
          if (nullIfNotFound && httpError?.status === 404) {
            return of(null);
          } else {
            throw err;  //pass along
          }
        }),
        finalize(() => this.setWorking(false))
      );
  }
  getPhotographerByUsername(username: string, nullIfNotFound?: boolean): Observable<IGamePhotographer | null> {
    const url = this.buildUrl(['photographers', 'username', encodeURI(username)]);
    return this.http.get(url)
      .pipe(
        map((result: any) => new GamePhotographer(result)),
        catchError((err) => {
          const httpError = parseHttpError(err);
          if (nullIfNotFound && httpError?.status === 404) {
            return of(null);
          } else {
            throw err;  //pass along
          }
        }),
        finalize(() => this.setWorking(false))
      );
  }

  addPhotographer(data: any): Observable<IGamePhotographer> {
    const photographer = new GamePhotographer(data);
    const url = this.buildUrl(['photographers']);
    return this.http.post(url, photographer)
      .pipe(
        map((result: any) => new GamePhotographer(result)),
        finalize(() => this.setWorking(false))
      );
  }

  //#endregion


  //#region >>> PHOTO GETTERS <<<

  getPhotosByUsername(username: string): Observable<IGamePhoto[]> {
    this.setWorking(true);
    const url = this.buildUrl(['photos', 'photographer', encodeURI(username)]);
    return this.http.get<any[]>(url)
      .pipe(
        map((resp: any[]) => {
          return resp.map(m => new GamePhoto(m));
        }),
        finalize(() => this.setWorking(false))
      );
  }

  getPhotosByTag(tag: string): Observable<IGamePhoto[]> {
    this.setWorking(true);
    const url = this.buildUrl(['photos', 'tags', encodeURI(tag)]);
    return this.http.get<any[]>(url)
      .pipe(
        map((resp: any[]) => {
          return resp.map(m => new GamePhoto(m));
        }),
        finalize(() => this.setWorking(false))
      );
  }

  getPhotosByTopic(topic: string): Observable<IGamePhoto[]> {
    this.setWorking(true);
    const url = this.buildUrl(['photos', 'topics', encodeURI(topic)]);
    return this.http.get<any[]>(url)
      .pipe(
        map((resp: any[]) => {
          return resp.map(m => new GamePhoto(m));
        }),
        finalize(() => this.setWorking(false))
      );
  }

  getPhotoById(id: string): Observable<IGamePhoto> {
    this.setWorking(true);
    const url = this.buildUrl(['photos', encodeURI(id)]);
    return this.http.get(url)
      .pipe(
        map(resp => new GamePhoto(resp)),
        finalize(() => this.setWorking(false))
      );
  }



  //#endregion


  //#region >>> PHOTO SETTERS <<<

  addPhoto(data: any, photographerUsername?: string): Observable<IGamePhoto> {
    data.photographer = {
      username: photographerUsername,
      ...data.photographer
    };

    const photo = new GamePhoto(data);
    if (photo?.username) {
      this.setWorking(true);

      //fix any errors before posting
      if (photo.description && photo.description.length > 500) {
        photo.description = photo.description?.substring(0, 500); //truncate!  
      }

      const url = this.buildUrl(['photos']);
      return this.http.post(url, photo)
        .pipe(
          map((result: any) => new GamePhoto(result)),
          finalize(() => this.setWorking(false))
        );  
    }

    //else
    console.warn("unable to add photo - missing photographer username", {data, photo});
    throw new Error("Unable to add photo");
  }

  patchPhoto(id: string, patches: IPatchDto | IPatchDto[]): Observable<IGamePhoto> {
    this.setWorking(true);
    patches = Array.isArray(patches) ? patches : [patches];
    const url = this.buildUrl(['photos', encodeURI(id), 'multiple']);
    return this.http.patch(url, patches)
      .pipe(
        map((result: any) => new GamePhoto(result)),
        finalize(() => this.setWorking(false))
      ); 
  }


  //#endregion


  //#region >>> AWARD WINNERS <<<

  awardCategories(year: number): Observable<IGameAwardCategory[]> {
    const url = this.buildUrl(['award-winners', 'categories', `${year}`]);
    this.setWorking(true);
    return this.http.get<{[key: string]: number}>(url)
      .pipe(
        map(resp => {
          return Object.keys(resp)
            .map(category => {
              return {
                year,
                category,
                count: resp[category]
              } as IGameAwardCategory;
            })
        }),
        finalize(() => this.setWorking(false))
      );
  }

  getAwardWinners(category: string, year?: number): Observable<IGameAwardPhoto[]> {
    const path = ['award-winners', 'category', encodeURI(category)];
    if (typeof(year) === 'number') {
      path.push(`${year}`);
    }
    const url = this.buildUrl(path);
    this.setWorking(true);
    return this.http.get<IGameAwardPhoto[]>(url)
      .pipe(
        map((results) => results.map(m => new GameAwardPhoto(m))),
        finalize(() => this.setWorking(false))
      );
  }

  addAwardWinner(photoId: string, category: string, year: number, winner: boolean = false) {
    const data = { photoId, category, year, winner };
    const url = this.buildUrl(['award-winners']);
    this.setWorking(true);
    return this.http.post(url, data)
      .pipe(
        map(resp => new GameAwardPhoto(resp)),
        finalize(() => this.setWorking(false))
      );
  }

  //#endregion


  addPhotoFromUnsplashObj(data: any) {
    const raw = {...data};
    const photo = new GamePhoto(data);
    
    if (photo?.photographer?.username) {
      this.setWorking(true);
      

      //check to see if the photographer (user) is already created
      return this.getPhotographerByUsername(photo.photographer?.username, true) //returns null if not found
        .pipe(
          switchMap((user) => {
            if (user?.username) {
              photo.photographer = user;
              return this.addPhoto(photo);
            } else {
              //first add the photographer and then add photo
              return this.addPhotographer(photo.photographer)
                .pipe(
                  switchMap(photographer => {
                    console.log("addPhotographer", photographer);
                    photo.photographer = photographer;
                    return this.addPhoto(photo);
                  })
                )
            }
          }),
          finalize(() => this.setWorking(false))
        );
    }

    //else
    console.warn("unable to add TEMP photo - missing photographer username", {data, photo, raw});
    throw new Error("Unable to add TEMP photo");
  }
}