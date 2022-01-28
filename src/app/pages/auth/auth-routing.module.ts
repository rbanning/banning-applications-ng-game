import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageTitleGuard, AuthGuard } from '@app/core/services';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';

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

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
