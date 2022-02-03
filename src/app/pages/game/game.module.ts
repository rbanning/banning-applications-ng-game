import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared';
import { gameComponents } from './components';
import { GameRoutingModule } from './game-routing.module';
import { GameComponent } from './game.component';


@NgModule({
  declarations: [
    gameComponents,
    GameComponent
  ],
  imports: [
    SharedModule,
    GameRoutingModule
  ]
})
export class GameModule { }
