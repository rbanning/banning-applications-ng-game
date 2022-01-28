import { generateUUID } from "../common";

export const DEFAULT_DELAY = 5; //seconds
export type ToastMode = 'info' | 'success' | 'warning' | 'error';
export interface IToastBasic {
  mode: ToastMode;
  text: string;
  delay?: number;
}
export interface IToast extends IToastBasic {
  id: string;
}

export class Toast implements IToast {
  id: string;
  mode: ToastMode = 'info';
  text: string = 'attention';
  delay: number = DEFAULT_DELAY;

  constructor(obj: any = null) {
    this.id = generateUUID();
    if (typeof(obj) === 'string') {
      this.text = obj;
    } else if (typeof(obj) === 'object') {
      this.id = obj.id || this.id;
      this.mode = obj.mode;
      this.text = obj.text;
      if (typeof(obj.delay) === 'number') { this.delay = obj.delay; }
    }
  }
}