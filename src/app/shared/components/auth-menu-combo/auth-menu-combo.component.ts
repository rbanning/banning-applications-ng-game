import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthService, AuthStoreResult } from '@app/core';
import { IPopMenuItem, IPopMenuItemEnhanced } from '../popup-menu/popup-menu.component';

export type TriggerMode = "text" | "icon";

@Component({
  selector: 'app-auth-menu-combo',
  templateUrl: './auth-menu-combo.component.html',
  styleUrls: ['./auth-menu-combo.component.css']
})
export class AuthMenuComboComponent implements OnInit {
  auth$: Observable<AuthStoreResult>;
  showMenu: boolean = false;

  @Input()
  mode: TriggerMode = 'icon';

  @Output()
  activated = new EventEmitter<IPopMenuItemEnhanced>();

  constructor(
    private authService: AuthService
  ) { 
    this.auth$ = authService.getAuthStatus$();
  }

  ngOnInit(): void {
  }

  activate(item: IPopMenuItemEnhanced) {
    this.activated.emit(item);  //pass along
  }

  authPopupMenuItems: IPopMenuItem[] = [
    {
      text: "Profile",
      action: ['/auth']
    },
    {
      text: "Logout",
      action: ['/auth', 'logout']
    }
  ];
  noAuthPopupMenuItems: IPopMenuItem[] = [
    {
      text: "Login",
      action: ['/auth', 'login']
    },
    {
      text: "Register",
      action: ['/auth', 'register']
    }
  ];
}
