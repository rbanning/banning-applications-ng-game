import { NgModule } from '@angular/core';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { SharedModule } from '@app/shared';
import { LogoutComponent } from './logout/logout.component';


@NgModule({
  declarations: [
    AuthComponent,
    LoginComponent,
    LogoutComponent
  ],
  imports: [
    AuthRoutingModule,
    SharedModule
  ]
})
export class AuthModule { }
