import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { AuthService } from '@app/core';
import { IAuth, IUser } from '@app/shared/models';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  auth$: Observable<IAuth | null>;

  constructor(
    private authService: AuthService
  ) { 
    this.auth$ = authService.getAuthStatus$();
  }

  ngOnInit(): void {
  }

}
