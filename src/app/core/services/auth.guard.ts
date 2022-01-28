import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';

const LOGIN_URL = 'auth/login';
@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {

      if (!this.authService.isAuthenticated()) {
        this.router.navigate([LOGIN_URL]);
        return false;
      } else {
        //check to see if the route is restricted by roles
        let roles = next.data["roles"] as Array<string>;
        if (roles?.length > 0) {
          const user = this.authService.getCurrentUser();
          if (!user?.role || !roles.includes(user.role)) {
            this.router.navigate([LOGIN_URL]);
            return false;    
          }
        }
      }
      return true;
  }

}
