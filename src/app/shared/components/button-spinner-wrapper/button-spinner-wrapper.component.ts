import { Component, Input } from '@angular/core';
import { SpinnerSize, SpinnerTheme } from '..';

@Component({
  selector: 'app-button-spinner-wrapper',
  templateUrl: './button-spinner-wrapper.component.html',
  styleUrls: ['./button-spinner-wrapper.component.css'],
})
export class ButtonSpinnerWrapperComponent {
  @Input() buttonText: string = '';
  @Input() working: boolean = false;
  
  @Input() 
  theme: SpinnerTheme = 'none';
  @Input()
  size: SpinnerSize = 'sm';
  
  constructor() { }

}
