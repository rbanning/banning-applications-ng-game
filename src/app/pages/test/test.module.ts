import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared';

import { TestRoutingModule } from './test-routing.module';
import { TestComponent } from './test.component';


@NgModule({
  declarations: [
    TestComponent
  ],
  imports: [
    TestRoutingModule,
    SharedModule
  ]
})
export class TestModule { }
