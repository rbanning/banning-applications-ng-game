import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard, PageTitleGuard } from '@app/core/services';
import { GameComponent } from './game.component';
import { ThreeLetterWordHomeComponent } from './three-letter-word/three-letter-word-home/three-letter-word-home.component';
import { UnsplashBuilderComponent } from './unsplash-builder/unsplash-builder.component';
import { UnsplashHomeComponent } from './unsplash/unsplash-home/unsplash-home.component';

const routes: Routes = [
  { 
    path: '', 
    component: GameComponent,
    canActivate: [PageTitleGuard, AuthGuard], //restrict to authenticated users
    data: { title: 'The Game' }
  },
  { 
    path: 'three-letter-word', 
    component: ThreeLetterWordHomeComponent,
    canActivate: [PageTitleGuard, AuthGuard], //restrict to authenticated users
    data: { title: 'Three Letter Word Game' }
  },
  { 
    path: 'unsplash', 
    component: UnsplashHomeComponent,
    canActivate: [PageTitleGuard, AuthGuard], //restrict to authenticated users
    data: { title: 'Unsplash Game' }
  },
  { 
    path: 'unsplash/:game', 
    component: UnsplashHomeComponent,
    canActivate: [PageTitleGuard, AuthGuard], //restrict to authenticated users
    data: { title: 'Unsplash Game' }
  },
  { 
    path: 'unsplash-builder', 
    component: UnsplashBuilderComponent,
    canActivate: [PageTitleGuard, AuthGuard], //restrict to authenticated users
    data: { title: 'Unsplash Builder' }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GameRoutingModule { }
