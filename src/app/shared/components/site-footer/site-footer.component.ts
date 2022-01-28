import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-site-footer',
  templateUrl: './site-footer.component.html',
  styleUrls: ['./site-footer.component.css']
})
export class SiteFooterComponent implements OnInit {
  copyrightYr: number;
  constructor() { 
    this.copyrightYr = (new Date()).getFullYear();
  }

  ngOnInit(): void {
  }

}
