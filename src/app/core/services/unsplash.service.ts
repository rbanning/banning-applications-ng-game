import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { finalize, map, Observable } from "rxjs";

import { ConfigService } from "./config.service";
import { IConfig, GamePhoto, IGamePhoto, WorkingService, WorkingHttpService } from "@app/shared/models";

export interface ISearchResult {
  query: string;
  total?: number;
  total_pages?: number;
  results?: IGamePhoto[]
}
export type ColorFilter ='black_and_white' | 'black' | 'white' | 'yellow' | 'orange' | 'red' | 'purple' | 'magenta' | 'green' | 'teal' | 'blue' | null;
export type OrientationFilter = 'landscape' | 'portrait' | 'squarish' | null;

@Injectable()
export class UnsplashService extends WorkingHttpService {
  private readonly config: IConfig;

  constructor(
    private configService: ConfigService,
    private http: HttpClient
  ) {
    super();
    this.config = configService.getAll();
    this.BASE_URL = 'https://api.unsplash.com/';
  }


  getPhoto(id: string): Observable<IGamePhoto> {
    const url = this.buildUrl(['photos', encodeURI(id)]);
    return this.fetch(url)
      .pipe(
        map(resp => new GamePhoto(resp)),
        finalize(() => this.setWorking(false))
      )
  }

  getPhotoRaw(id: string): Observable<any> {
    const url = this.buildUrl(['photos', encodeURI(id)]);
    return this.fetch(url)
      .pipe(
        finalize(() => this.setWorking(false))
      )
  }

  search(
    query: string, 
    color: ColorFilter = null,
    orientation: OrientationFilter = null,
    page: number = 1,
    per_page: number = 10): Observable<ISearchResult> {

      //build url
      const queryParams: any = { query };
      if (color) {
        queryParams.color = color;
      }
      if (orientation) {
        queryParams.orientation = orientation;
      }
      const url = this.buildUrl(['search', 'photos'], queryParams);
      this.setWorking(true);
      return this.fetch(url)
        .pipe(
          map((resp: any) => {
            const result: ISearchResult = {
              query,
              total: resp?.total,
              total_pages: resp?.total_pages
            };
            if (Array.isArray(resp.results)) {
              result.results = resp.results.map((m: any) => new GamePhoto(m));
            }
            console.log("DEBUG: unsplash search results", {resp, result})
            return result;
          }),
          finalize(() => { this.setWorking(false); })
        );
  }


  private fetch(url: string) {
    const headers = this.createAuthHeaders();
    return this.http.get(url, { headers });
  }

  private createAuthHeaders(): HttpHeaders {
    const headers = new HttpHeaders();
    //careful... .append returns a clone with the added header.  HttpHeaders is immutable
    return headers.append('Authorization',  `Client-ID ${this.config.unsplash_api}`);
  }
}