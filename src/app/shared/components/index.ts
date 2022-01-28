import { ButtonSpinnerWrapperComponent } from "./button-spinner-wrapper/button-spinner-wrapper.component";
import { InputErrorComponent } from "./input-error/input-error.component";
import { SiteFooterComponent } from "./site-footer/site-footer.component";
import { SiteHeaderComponent } from "./site-header/site-header.component";
import { SpinnerComponent } from "./spinner/spinner.component";
import { ToastMessengerComponent } from "./toast-messenger/toast-messenger.component";
import { WorkingComponent } from "./working/working.component";

export const sharedComponents = [
  SiteHeaderComponent,
  SiteFooterComponent,
  ToastMessengerComponent,
  WorkingComponent,
  InputErrorComponent,
  SpinnerComponent,
  ButtonSpinnerWrapperComponent
];

export * from './site-header/site-header.component';
export * from './site-footer/site-footer.component';
export * from './toast-messenger/toast-messenger.component';
export * from './input-error/input-error.component';
export * from './spinner/spinner.component';
export * from './button-spinner-wrapper/button-spinner-wrapper.component';
