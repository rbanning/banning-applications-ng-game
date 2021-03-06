import { AuthGuard } from "./auth.guard";
import { AuthService } from "./auth.service";
import { BannAppsUnsplashService } from "./bannapps-unsplash.service";
import { ConfigService } from "./config.service";
import { LetterWordGameService } from "./letter-word-game.service";
import { PageTitleGuard } from "./page-title.guard";
import { StorageService } from "./storage.service";
import { ToastService } from "./toast.service";
import { UnsplashGameService } from "./unsplash-game.service";
import { UnsplashService } from "./unsplash.service";

export const sharedServices = [
  ConfigService,
  StorageService,
  ToastService,
  AuthService,
  UnsplashService,
  BannAppsUnsplashService,
  UnsplashGameService,
  LetterWordGameService
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
export * from './toast.service';
export * from './unsplash.service';
export * from './bannapps-unsplash.service';
export * from './unsplash-game.service';
export * from './letter-word-game.service';

//not including mocks in the base services index.  
//they should be access directly from /mocks.
//do NOT export * from './mocks';  //note: these are not injectable services and are not included in sharedServices

