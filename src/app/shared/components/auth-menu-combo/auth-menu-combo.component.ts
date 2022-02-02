import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthService, AuthStoreResult } from '@app/core';
import { IPopMenuItem } from '..';

@Component({
  selector: 'app-auth-menu-combo',
  templateUrl: './auth-menu-combo.component.html',
  styleUrls: ['./auth-menu-combo.component.css']
})
export class AuthMenuComboComponent implements OnInit {
  auth$: Observable<AuthStoreResult>;
  showMenu: boolean = false;

  constructor(
    private authService: AuthService
  ) { 
    this.auth$ = authService.getAuthStatus$();
  }

  ngOnInit(): void {
  }

  authPopupMenuItems: IPopMenuItem[] = [
    {
      text: "Profile",
      action: ['auth']
    },
    {
      text: "Logout",
      action: ['auth', 'logout']
    }
  ];
  noAuthPopupMenuItems: IPopMenuItem[] = [
    {
      text: "Login",
      action: ['auth', 'login']
    },
    {
      text: "Register",
      action: ['auth', 'register']
    }
  ];
}
