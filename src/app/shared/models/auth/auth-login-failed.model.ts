
export type AuthLoginFailReason = "invalid" | "lockout" | "not_activated" | "unknown";
export class AuthLoginFailed {
  reason: AuthLoginFailReason = "unknown";
  message: string | null = null;
  constructor(obj: any | string = null) {
    switch (typeof(obj)) {
      case "string":
        this.message = obj;
        break;
      case "object":
        this.reason = obj.reason;
        this.message = obj.message;
        break;
    }
  }
}