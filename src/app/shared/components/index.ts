import { SiteFooterComponent } from "./site-footer/site-footer.component";
import { SiteHeaderComponent } from "./site-header/site-header.component";
import { ToastMessengerComponent } from "./toast-messenger/toast-messenger.component";

export const sharedComponents = [
  SiteHeaderComponent,
  SiteFooterComponent,
  ToastMessengerComponent
];

export * from './site-header/site-header.component';
export * from './site-footer/site-footer.component';
export * from './toast-messenger/toast-messenger.component';
