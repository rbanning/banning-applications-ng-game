import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastService } from '@app/core/services/toast.service';
import { IToast } from '@app/shared/models';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-toast-messenger',
  templateUrl: './toast-messenger.component.html',
  styleUrls: ['./toast-messenger.component.css']
})
export class ToastMessengerComponent implements OnInit, OnDestroy {
  toast: IToast | null = null;
  subscriptions: Subscription[] = [];
  toastLoaded: boolean = false;

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.toastService.getObservable().subscribe({
        next: ((result: IToast | null) => {
          this.load(result);
        }),
        error: (err => {
          console.warn("ToastMessengerComponent found an error in the Toast stream", {err});
        })
      })
    );
  }
  
  ngOnDestroy(): void {
    //clean up - unsubscribe to any subscriptions
    if (this.subscriptions) {
      this.subscriptions.forEach(sub => {
        sub.unsubscribe();
      });
    }
  }

  load(toast: IToast | null) {
    this.toast = toast;
    if (toast) {
      console.log("DEBUG loading", {toast});
      this.toastLoaded = true;
      window.setTimeout(() => { this.toastLoaded = false; }, 2000);
    }
  }

  close() {
    this.toastService.close();
  }


}
