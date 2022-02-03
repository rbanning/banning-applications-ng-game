import { Component, OnInit } from '@angular/core';
import { ConfigService } from '@app/core';
import { ToastService } from '@app/core/services/toast.service';
import { ToastMode } from '@app/shared/models';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private _working = new BehaviorSubject<boolean>(false);
  working$: Observable<boolean>;
  working: boolean = false;

  constructor(
    private configService: ConfigService,
    private toastService: ToastService
    ) { 
    this.working$ = this._working.asObservable();
  }

  ngOnInit(): void {
    const config = this.configService.getAll();
  }

  toggleWorking() {
    this._working.next(!this._working.value);
    this.working = this._working.value;
  }

  addToast(mode: ToastMode) {
    this.toastService.add({
      mode,
      text: `This is a sample ${mode} toast ready to go! This is long toast with lots of information that will hopefully wrap onto the next line and get really funky as it become tedious to read especially since you only have five (5) seconds before I disappear!`
    });
  }
}
