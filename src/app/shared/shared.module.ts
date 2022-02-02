import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { sharedComponents } from './components';
import { PopupMenuComponent } from './components/popup-menu/popup-menu.component';
import { AuthMenuComboComponent } from './components/auth-menu-combo/auth-menu-combo.component';



@NgModule({
  declarations: [
    // pipes,
    sharedComponents,
    PopupMenuComponent,
    AuthMenuComboComponent,
    // sharedDirectives,
    // IsEmptyPipe,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  providers: [
    // pipeProviders
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    // pipes,
    sharedComponents,
    // sharedDirectives,
  ]
})
export class SharedModule { }
