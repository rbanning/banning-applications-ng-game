import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service';
import { ConfigService } from "./config.service";

@Injectable()
export class RequestTokenInterceptorService implements HttpInterceptor {
  private readonly AUTH_HEADER = "Authorization";

  constructor(
    private config: ConfigService,
    private auth: AuthService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //we only include the token for requests to the os api (and the auth api)
    const url: string = req.url;
    const service_request = this.requiresToken(url);
    let headers = req.headers;

    if (service_request) {
      const token = `Bearer ${this.auth.getAuthenticationToken()}`;
      headers = headers.append(this.AUTH_HEADER, token);
    }
    
    //clone the request
    const authReq = req.clone({ headers });
    
    //pass it along
    return next.handle(authReq);

  }

  private requiresToken(url: string): boolean {
    if (url) {
      url = url.toLocaleLowerCase();
      const {os_url, auth_url} = this.config.getAll();
      if (os_url && auth_url) {
        return url.indexOf(os_url) === 0 || url.indexOf(auth_url) === 0;
      } 
    }
    //else
    return false;
  }
}
