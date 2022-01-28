import { Component, OnInit } from '@angular/core';
import { ToastService } from '@app/core/services/toast.service';
import { ToastMode } from '@app/shared/models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private toastService: ToastService) { }

  ngOnInit(): void {
  }

  addToast(mode: ToastMode) {
    this.toastService.add({
      mode,
      text: `This is a sample ${mode} toast ready to go! This is long toast with lots of information that will hopefully wrap onto the next line and get really funky as it become tedious to read especially since you only have five (5) seconds before I disappear!`
    });
  }
}
