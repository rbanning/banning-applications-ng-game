import { IConfig } from "@app/shared/models";

export class MockConfigService {

  constructor(private prefix: string) { 
    console.log("DEBUG: MockConfigService", {prefix});
  }

  keys(): string[] {
    return [this.prefix];
  }

  hasKey(key: string): boolean {
    return key === this.prefix;
  }

  get(key: string): string | boolean | null {
    //NOTE: workaround to access the key of an interface
    //      typescript (strict) requires us to cast as any
    if (this.hasKey(key)) { return true; }
    //else
    return null;
  }

  getAll(): IConfig {
    return {
      appName: this.prefix
    };
  }
}