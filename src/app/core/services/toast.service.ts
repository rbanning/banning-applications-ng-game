import { Injectable } from "@angular/core";
import { IToast, IToastBasic, Toast, ToastMode } from "@app/shared/models";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable()
export class ToastService {
  private _backlog: IToast[] = [];
  private _store = new BehaviorSubject<IToast | null>(null);

  isActive() {
    return this._store.value !== null;
  }

  currentToast(): IToast | null {
    return this._store.value;
  }

  getObservable(): Observable<IToast | null> {
    return this._store.asObservable();
  }

  add(toast: IToastBasic | string): IToast {
    const ret = new Toast(toast);

    //push onto the _backlog if active
    if (this.isActive()) {
      this._backlog.push(ret);
    } else {
      this.activateToast(ret);
    }

    return ret;
  }

  addAs(mode: ToastMode, text: string, delay?: number) {
    return this.add({mode, text, delay});
  }

  
  //indicated that the current toast is has been dismissed or timed-out
  //  - if there are any items on the _backlog, queue the next toast
  //  - otherwise push NULL on to the _store subject
  close() {
    this.activateToast(this._backlog.shift() || null)
  }


  private scheduleClose(toast: IToast) {
    if (toast?.delay) {
      window.setTimeout(() => {
        if (this.currentToast()?.id === toast.id) {
          this.close();
        }
      }, toast.delay * 1000);
    }
  }

  private activateToast(toast: IToast | null) {
    this._store.next(toast);
    if (toast) { this.scheduleClose(toast); }
  }

}
