import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared';
import { gameComponents } from './components';
import { GameRoutingModule } from './game-routing.module';
import { GameComponent } from './game.component';
import { UnsplashHomeComponent } from './unsplash/unsplash-home/unsplash-home.component';


@NgModule({
  declarations: [
    gameComponents,
    GameComponent,
    UnsplashHomeComponent
  ],
  imports: [
    SharedModule,
    GameRoutingModule
  ]
})
export class GameModule { }
