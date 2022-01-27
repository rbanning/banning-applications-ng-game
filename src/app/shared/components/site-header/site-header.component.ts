import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-site-header',
  templateUrl: './site-header.component.html',
  styleUrls: ['./site-header.component.css']
})
export class SiteHeaderComponent implements OnInit {
  @Input()
  brand: string = "Banning Applications";

  popupOpen: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  togglePopup() {
    this.popupOpen = !this.popupOpen;
  }
}
