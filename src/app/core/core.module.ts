import { NgModule, Optional, SkipSelf } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { BrowserModule } from '@angular/platform-browser';
import { SharedModule } from '../shared/shared.module';
import { EnsureModuleLoadedOnceGuard } from './ensure-module-loaded-once.guard';
import { RequestTokenInterceptorService, sharedGuards, sharedServices } from './services';



@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    HttpClientModule,
    SharedModule
  ],
  providers: [
    sharedServices,
    sharedGuards,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestTokenInterceptorService,
      multi: true
    },
  ]
})
export class CoreModule extends EnsureModuleLoadedOnceGuard {   // Ensure that CoreModule is only loaded into AppModule

  // Looks for the module in the parent injector to see if it's already been loaded (only want it loaded once)
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    super(parentModule);
  }
}
