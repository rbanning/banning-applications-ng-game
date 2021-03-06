import { AuthMenuComboComponent } from "./auth-menu-combo/auth-menu-combo.component";
import { ButtonSpinnerWrapperComponent } from "./button-spinner-wrapper/button-spinner-wrapper.component";
import { InputErrorComponent } from "./input-error/input-error.component";
import { ModalComponent } from "./modal/modal.component";
import { PopupMenuComponent } from "./popup-menu/popup-menu.component";
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
  ButtonSpinnerWrapperComponent,
  PopupMenuComponent,
  AuthMenuComboComponent,
  ModalComponent,
];

export * from './site-header/site-header.component';
export * from './site-footer/site-footer.component';
export * from './toast-messenger/toast-messenger.component';
export * from './input-error/input-error.component';
export * from './spinner/spinner.component';
export * from './button-spinner-wrapper/button-spinner-wrapper.component';
export * from './popup-menu/popup-menu.component';
export * from './auth-menu-combo/auth-menu-combo.component';
export * from './modal/modal.component';
