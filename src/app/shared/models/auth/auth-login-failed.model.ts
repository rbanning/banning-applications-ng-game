
export type AuthLoginFailReason = "invalid" | "lockout" | "not_activated" | "unknown";
export class AuthLoginFailed {
  reason: AuthLoginFailReason = "unknown";
  message: string | null = null;
  constructor(obj: any = null) {
    if (obj) {
      this.reason = obj.reason;
      this.message = obj.message;
    }
  }
}