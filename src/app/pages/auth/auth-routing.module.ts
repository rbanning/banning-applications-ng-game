import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageTitleGuard, AuthGuard } from '@app/core/services';
import { AuthComponent } from './auth.component';
import { ForgotComponent } from './forgot/forgot.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  { 
    path: '', 
    component: AuthComponent,
    canActivate: [PageTitleGuard, AuthGuard], //restrict to authenticated users
    data: { title: 'My Profile'} 
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [PageTitleGuard],
    data: { title: 'Login' }
  },
  {
    path: 'logout',
    component: LogoutComponent,
    canActivate: [PageTitleGuard],
    data: { title: 'Logout' }
  },
  {
    path: 'forgot',
    component: ForgotComponent,
    canActivate: [PageTitleGuard],
    data: { title: 'Forgot Password' }
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [PageTitleGuard],
    data: { title: 'Register' }
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
