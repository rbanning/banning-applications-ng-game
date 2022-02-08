import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared';
import { gameComponents } from './components';
import { GameRoutingModule } from './game-routing.module';
import { GameComponent } from './game.component';
import { UnsplashHomeComponent } from './unsplash/unsplash-home/unsplash-home.component';
import { UnsplashBuilderComponent } from './unsplash-builder/unsplash-builder.component';
import { ThreeLetterWordHomeComponent } from './three-letter-word/three-letter-word-home/three-letter-word-home.component';
import { FourLetterWordHomeComponent } from './four-letter-word/four-letter-word-home/four-letter-word-home.component';
import { FiveLetterWordHomeComponent } from './five-letter-word/five-letter-word-home/five-letter-word-home.component';


@NgModule({
  declarations: [
    gameComponents,
    GameComponent,
    UnsplashBuilderComponent,
    UnsplashHomeComponent,
    ThreeLetterWordHomeComponent,
    FourLetterWordHomeComponent,
    FiveLetterWordHomeComponent,
  ],
  imports: [
    SharedModule,
    GameRoutingModule
  ]
})
export class GameModule { }
