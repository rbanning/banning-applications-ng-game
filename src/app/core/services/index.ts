import { AuthGuard } from "./auth.guard";
import { AuthService } from "./auth.service";
import { ConfigService } from "./config.service";
import { PageTitleGuard } from "./page-title.guard";
import { StorageService } from "./storage.service";
import { ToastService } from "./toast.service";

export const sharedServices = [
  ConfigService,
  StorageService,
  ToastService,
  AuthService
];


export const sharedGuards = [
  PageTitleGuard,
  AuthGuard
];

export * from './async-storage.model';

export * from './request-token-interceptor.service';

export * from './config.service';
export * from './storage.service';
export * from './auth.service';
export * from './page-title.guard';
export * from './auth.guard';

//not including mocks in the base services index.  
//they should be access directly from /mocks.
//do NOT export * from './mocks';  //note: these are not injectable services and are not included in sharedServices

