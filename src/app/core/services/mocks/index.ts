import { MockConfigService } from "./mock-config.service";
import { MockService } from "./mock.service";

export const mockServices = [
  MockService,
  MockConfigService,
];

export * from './mock.service';
export * from './mock-config.service';
