import { NgModule, Provider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { DragDropModule } from '@angular/cdk/drag-drop';

import { sharedComponents } from './components';
import { sharedDirectives } from './directives';
import { sharedPipes } from './pipes';

export const pipeProviders: Provider[] = sharedPipes.map(p => {
  return {provide: p, useClass: p};
});


@NgModule({
  declarations: [
    sharedPipes,
    sharedComponents,
    sharedDirectives,
    // IsEmptyPipe,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    DragDropModule
  ],
  providers: [
    pipeProviders
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    DragDropModule,
    sharedPipes,
    sharedComponents,
    sharedDirectives,
  ]
})
export class SharedModule { }
