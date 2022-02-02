import { BehaviorSubject, interval, Observable, of, switchMap, throwError } from "rxjs";

import { Auth, IAuth, IUser, User } from "@app/shared/models";
import * as dayjs from "dayjs";
import { AuthStoreResult } from "../auth.service";
import { StorageService } from "../storage.service";

export const defaultMockUser: IUser = new User({
  id: "0000",
  name: "Mock User",
  email: null,
  phone: "222-333-4444",
  role: "viewer",
});

export class MockAuthService {
  public readonly mockToken: string = btoa("mock-token");
  private _mockRunningRefreshPeriodically = false;

  //let's share the authSubject and storage service
  authSubject = new BehaviorSubject<AuthStoreResult>(null);
  storage: StorageService = new StorageService();
  AUTH_KEY: string = 'mock-auth';

  constructor(
    private _mockEmail: string, 
    private _mockPassword: string | null = null,
    private _mockUser: IUser | null = null,
    private _mockExpiresInHours: number = 24 
    ) { 
      this._mockUser = new User({
        ...defaultMockUser,
        email: _mockEmail,
        ..._mockUser
      });
    }

    login(email: string, password: string): Observable<IUser | null> {
      if (email.toLocaleLowerCase() === this._mockEmail.toLocaleLowerCase() 
          && (!this._mockPassword || password === this._mockPassword)) {

            const auth = this.mockCreateAuthResult();

            if (auth.isAuthenticated()) {
              this.setAuth(auth);
              return of(auth.user);
            } else {
              //todo: what should we do if auth is not authenticated?
            }
      }

      //else
      return of(null);
    }

    refresh(updateWorking: boolean = false): Observable<IUser | null> {
      if (this.mockIsAuthenticated()) {
        const auth = this.mockCreateAuthResult();
        this.setAuth(auth);
        console.log("DEBUG: Auth Refreshed", {auth});
        return of(auth.user);
      } else {
        return of(null);  //not authenticated so no need to try to authenticate
      }
    }
  
    refreshPeriodically(minutes: number, smartRefresh: boolean = true): Observable<IUser | null> {
      if (this._mockRunningRefreshPeriodically) { 
        console.warn("Cannot run refresh periodically - already running"); 
        return throwError(() => "Token auto-refresh is already running");
      }
  
      this._mockRunningRefreshPeriodically = true;
      return interval(minutes * 60 * 1000 /* convert minutes to ms */)
        .pipe(
          switchMap(_ => {
            //under smartRefresh, refresh when the token will expire within the next three (3) iterations of the interval 
            if (navigator.onLine) {
              return this.refresh();
            } else {
              return of(null); //no refresh
            }
          })
        );
    }

    private setAuth(auth: IAuth | null) {
      this.authSubject.next(auth);
      if (auth && auth.isAuthenticated()) {
        this.storage.set(this.AUTH_KEY, auth);
      } else {
        this.storage.remove(this.AUTH_KEY);
      }
    }

    private mockCreateAuthResult() {
      return new Auth({
        user: this._mockUser,
        token: this.mockToken,
        expires: dayjs().add(this._mockExpiresInHours, "hours")
      });
    }

    private mockGetAuth() {
      return this.authSubject.value;
    }
    private mockIsAuthenticated() {
      const auth = this.mockGetAuth();
      if (auth) {
        if (auth.isAuthenticated()) { return true; }
        //else ... clear
        this.setAuth(null);
      }
      return false;
    }
  
}