import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-working',
  templateUrl: './working.component.html',
  styleUrls: ['./working.component.css']
})
export class WorkingComponent implements OnInit, OnDestroy {
  @Input()
  show: boolean | undefined;
  @Input()
  working$: Observable<boolean> | undefined;

  @Input()
  theme: 'primary' | 'accent' = 'primary';
  
  private subscriptions: Subscription[] = [];

  constructor() { }

  ngOnInit(): void {
    if (this.working$) {
      this.subscriptions.push(
        this.working$.subscribe({
            next: (show: boolean) => {
              this.show = show;
            }
         })
      );
    }
  }

  ngOnDestroy(): void {
    //clean up any subscriptions
    if (this.subscriptions){
      this.subscriptions.forEach(sub => { sub.unsubscribe(); });
    }
  }

}
