import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageTitleGuard } from '@app/core/services';
import { TestComponent } from './test.component';

const routes: Routes = [
  { path: '', 
  component: TestComponent,
  canActivate: [PageTitleGuard],
  data: { title: 'Testing...'}
 }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestRoutingModule { }
