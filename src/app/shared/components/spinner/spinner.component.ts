import { Component, Input, OnInit } from '@angular/core';

export type SpinnerSize = "sm" | "md" | "med" | "lg" | "xl";
export type SpinnerTheme = "primary" | "accent" | "light" | "none";

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent implements OnInit {
  @Input()
  theme: SpinnerTheme = "none";

  @Input()
  size: SpinnerSize = "sm";

  constructor() { }

  ngOnInit(): void {
  }

}
