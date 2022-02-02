import { IConfig } from "@app/shared/models";

export class MockConfigService {
  private _config: IConfig;

  constructor() { 
    this._config = {
      appName: "MOCK - Banning Apps",
      appScope: "00000000-0000-0000-0000-00000000",
      os_url: "",
      os_secret: "abc",
      auth_url: "",
      auth_registration_code: "",
      google_api: "",
      platform: "",
      production: false
    };
  }

  
}