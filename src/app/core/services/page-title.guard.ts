import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PageTitleGuard implements CanActivate {
  private readonly TITLE: string = "Banning Applications";

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      
      //update the page title based on data from the route
      const data: any = next.data as any;

      if (data.title) {
        document.title = `${data.title} * ${this.TITLE}`;
      } else {
        document.title = this.TITLE;
      }

      return true;
  }
  
}
