import { SiteFooterComponent } from "./site-footer/site-footer.component";
import { SiteHeaderComponent } from "./site-header/site-header.component";
import { ToastMessengerComponent } from "./toast-messenger/toast-messenger.component";
import { WorkingComponent } from "./working/working.component";

export const sharedComponents = [
  SiteHeaderComponent,
  SiteFooterComponent,
  ToastMessengerComponent,
  WorkingComponent
];

export * from './site-header/site-header.component';
export * from './site-footer/site-footer.component';
export * from './toast-messenger/toast-messenger.component';
