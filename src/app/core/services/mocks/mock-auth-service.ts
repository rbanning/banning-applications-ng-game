import { BehaviorSubject, Observable, of } from "rxjs";

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

            const auth = new Auth({
              user: this._mockUser,
              token: this.mockToken,
              expires: dayjs().add(this._mockExpiresInHours, "hours")
            });

            if (auth.isAuthenticated()) {
              this.setAuth(auth);
              return of(auth.user);
            } else {
            }
      }

      //else
      return of(null);
    }

    private setAuth(auth: IAuth | null) {
      this.authSubject.next(auth);
      if (auth && auth.isAuthenticated()) {
        this.storage.set(this.AUTH_KEY, auth);
      } else {
        this.storage.remove(this.AUTH_KEY);
      }
    }
}