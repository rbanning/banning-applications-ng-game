import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageTitleGuard } from './core/services';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [PageTitleGuard],
    data: { title: 'Home'}
  },
  {
    path: '404',
    component: NotFoundComponent,
    canActivate: [PageTitleGuard],
    data: { title: 'Oops...'}
  },
  { 
    path: 'test', 
    loadChildren: () => import('./pages/test/test.module').then(m => m.TestModule) 
  },
  { 
    path: 'auth', 
    loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthModule) 
  },
  {
    path: 'home',
    redirectTo: '/'
  },
  {
    path: '**',
    redirectTo: '/404'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
