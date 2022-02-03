import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { finalize, map, Observable } from "rxjs";

import { ConfigService } from "./config.service";
import { IConfig, WorkingService } from "@app/shared/models";
import { GamePhoto, IGamePhoto } from "@app/pages/game/components/models";

export interface ISearchResult {
  query: string;
  total?: number;
  total_pages?: number;
  results?: IGamePhoto[]
}
export type ColorFilter ='black_and_white' | 'black' | 'white' | 'yellow' | 'orange' | 'red' | 'purple' | 'magenta' | 'green' | 'teal' | 'blue' | null;
export type OrientationFilter = 'landscape' | 'portrait' | 'squarish' | null;

@Injectable()
export class UnsplashService extends WorkingService {
  private readonly config: IConfig;
  private readonly BASE_URL: string = 'https://api.unsplash.com/';

  constructor(
    private configService: ConfigService,
    private http: HttpClient
  ) {
    super();
    this.config = configService.getAll();
  }

  search(
    query: string, 
    color: ColorFilter = null,
    orientation: OrientationFilter = null,
    page: number = 1,
    per_page: number = 10): Observable<ISearchResult> {

      //build url
      let url = `${this.BASE_URL}search/photos?query=${encodeURI(query)}&page=${page}&per_page=${per_page}`;
      if (color) {
        url += `&color=${encodeURI(color)}`;
      }
      if (orientation) {
        url += `&orientation=${encodeURI(orientation)}`;
      }
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