import { MockAuthService } from "./mock-auth-service";
import { MockConfigService } from "./mock-config.service";
import { MockService } from "./mock.service";

export const mockServices = [
  MockService,
  MockConfigService,
  MockAuthService
];

export * from './mock.service';
export * from './mock-config.service';
export * from './mock-auth-service';

