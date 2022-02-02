import { Injectable } from '@angular/core';
import { IConfig } from '@app/shared/models';
import { environment } from 'src/environments/environment';
import { MockService, MockConfigService } from './mocks';

@Injectable()
export class ConfigService {
  private _config: IConfig;

  constructor() {
    this._config = {...environment} as IConfig;
    const mock = new MockService<ConfigService>(
      "ConfigService",
      ConfigService, this, MockConfigService);
  }

  
  keys(): string[] {
    return Object.keys(this._config);
  }

  hasKey(key: string): boolean {
    return key in this._config;
  }

  get(key: string): string | boolean | null {
    //NOTE: workaround to access the key of an interface
    //      typescript (strict) requires us to cast as any
    if (this.hasKey(key)) { return (this._config as any)[key]; }
    //else
    return null;
  }

  getAll(): IConfig {
    return {...this._config};
  }

}
