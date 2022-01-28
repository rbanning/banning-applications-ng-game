import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { BehaviorSubject, catchError, finalize, interval, map, Observable, of, switchMap, throwError } from "rxjs";

import { ConfigService } from "./config.service";
import { StorageService } from "./storage.service";
import { IAuth, Auth, IUser, AuthLoginFailed } from "@app/shared/models";
import { WorkingService } from "@app/shared/models";

import * as common from '@app/shared/common';

export type AuthStoreResult = IAuth | null;

@Injectable()
export class AuthService extends WorkingService {
  private AUTH_KEY: string = 'auth';
  private BASE_URL: string;
  private authSubject = new BehaviorSubject<AuthStoreResult>(null);
  private _runningRefreshPeriodically: boolean = false;

  constructor(
    private config: ConfigService,
    private storage: StorageService,
    private http: HttpClient
  ) {
    super();
    this.BASE_URL = this.config.getAll().auth_url || '';

    //see if the authentication creds are stored in local storage
    this.storage.get(this.AUTH_KEY)
      .then(result => {
        if (result) { 
          this.authSubject.next(new Auth(result));
          if (this.isAuthenticated()) {
            //refresh the user's auth token
            this.refresh()
              .subscribe((user) => {
                console.log("Refreshed the user's auth token (initial call)", {user});
              });
          }
        }
      });
  }

  //#region >> AUTH STATUS <<

  getAuthStatus$(): Observable<AuthStoreResult> {
    return this.authSubject.asObservable();
  }

  getCurrentUser(): IUser | null {
    const auth = this.getCurrentAuth();
    if (auth) {
      if (auth.isAuthenticated()) { return auth.user; }
      //... user's token has expired
      this.logout();  //clear
    }
    //else
    return null;
  }

  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.isAdmin() === true;
  }
  isManager(): boolean {
    const user = this.getCurrentUser();
    return user?.isManager() === true;
  }

  getAuthenticationToken(): string | null {
    const auth = this.getCurrentAuth();
    if (auth && auth.isAuthenticated()) {
      return auth.token;
    }
    //else
    return null;
  }

  getMinutesLeftOnToken(): number {
    const auth = this.getCurrentAuth();
    return auth ? auth.minutesLeft() || 0 : 0;
  }

  //#endregion
  

  //#region >> Principal Methods (login, logout, refresh, refreshPeriodically) <<

  logout() {
    this.setAuth(null);
  }

  login(email: string, password: string): Observable<IUser | null> {
    const data = {
      email,
      password,
      scope: this.config.getAll().appScope
    };
    this.setWorking(true);
    return this.http.post(this.BASE_URL, data)
      .pipe(
        map((result: any) => {
          return this.processAuthRequest(result);
        }),
        catchError(err => {
          if (err.error?.reason) { return throwError(() => new AuthLoginFailed(err.error)); }
          //else
          return throwError(() => this.parseResponse(err));
        }),
        finalize(() => this.setWorking(false))
      );
  }

  refresh(updateWorking: boolean = false): Observable<IUser | null> {
    if (this.isAuthenticated()) {
      const url = `${this.BASE_URL}refresh`;
      if (updateWorking) { this.setWorking(true); }
      return this.http.post(url, null)
        .pipe(
          map(result => {
            return this.processAuthRequest(result);
          }),
          catchError(err => {
            return throwError(() => this.parseResponse(err));
          }),
          finalize(() => {
            if (updateWorking) { this.setWorking(false); }
          })
        );
    } else {
      return of(null);  //not authenticated so no need to try to authenticate
    }
  }

  refreshPeriodically(minutes: number, smartRefresh: boolean = true): Observable<IUser | null> {
    if (this._runningRefreshPeriodically) { 
      console.warn("Cannot run refresh periodically - already running"); 
      return throwError(() => "Token auto-refresh is already running");
    }

    this._runningRefreshPeriodically = true;
    return interval(minutes * 60 * 1000 /* convert minutes to ms */)
      .pipe(
        switchMap(_ => {
          //under smartRefresh, refresh when the token will expire within the next three (3) iterations of the interval 
          if (navigator.onLine && !smartRefresh || (this.getMinutesLeftOnToken() < minutes * 3)) {
            return this.refresh();
          } else {
            return of(null); //no refresh
          }
        })
      );
  }


  //#endregion 
  

  //#region >> HELPERS <<

  private getCurrentAuth() {
    return this.authSubject.value;
  }

  private setAuth(auth: IAuth | null) {
    this.authSubject.next(auth);
    if (auth && auth.isAuthenticated()) {
      this.storage.set(this.AUTH_KEY, auth);
    } else {
      this.storage.remove(this.AUTH_KEY);
    }
  }

  private processAuthRequest(result: any) {
    if (result) {
      const auth = new Auth(result);
      if (auth.isAuthenticated()) {
        this.setAuth(auth);
        return auth.user;
      }
    }
    //else
    return null;
  }

  private parseResponse(resp: any): boolean | common.IHttpErrorResponse {
    return common.processHttpResponse(resp);
  }

  //#endregion
}