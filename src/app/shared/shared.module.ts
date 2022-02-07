import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { DragDropModule } from '@angular/cdk/drag-drop';

import { sharedComponents } from './components';
import { sharedDirectives } from './directives';



@NgModule({
  declarations: [
    // pipes,
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
    // pipeProviders
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    DragDropModule,
    // pipes,
    sharedComponents,
    sharedDirectives,
  ]
})
export class SharedModule { }
