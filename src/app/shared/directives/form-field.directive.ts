import { Directive, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: '[appFormField]'
})
export class FormFieldDirective implements OnInit {
  private label!: HTMLElement;
  private input!: HTMLInputElement;
  private enabled: boolean = false;

  constructor(
    private elementRef: ElementRef
  ) { }

  ngOnInit(): void {
    //ensure element has the 'field' css class
    this.elementRef.nativeElement.classList.toggle('field', true);

    //setup the label
    this.label = this.elementRef.nativeElement.querySelector('label');
    
    //setup the input
    this.input = this.elementRef.nativeElement.querySelector('input');
    
    this.enabled = !!this.input;  //if there is no label, one will be provided

    if (this.enabled) {
      this.onBlur(); //initially, set to onBlur state
      this.setupInput();
      this.setupLabel();
    }

    const html = this.elementRef.nativeElement.innerHTML;

    console.log("DEBUG: appFormField", {html, elementRef: this.elementRef, input: this.input, enabled: this.enabled});

  }

  setupLabel() {
    this.label.addEventListener('click', (_) => {
      this.input.focus();
    });
  }

  setupInput() {
    if (this.label) {
      //remove the placeholder if there is a label
      this.input.setAttribute('placeholder', '');
    } else {
      //create the label
      this.label = document.createElement('label');
      this.label.innerText = this.input.getAttribute('placeholder') || '';
      this.elementRef.nativeElement.insertBefore(this.label, this.input);
    }

    //add the listeners
    this.input.addEventListener('focus', this.onFocus.bind(this));
    this.input.addEventListener('blur', this.onBlur.bind(this));
    this.input.addEventListener('change', this.watchInput.bind(this));
  }

  watchInput(event: any) {
    //todo: what to do when an input changes value??
  }

  onFocus() {
    this.setCss('collapse', false);
    this.setCss('focus', true);
  }
  onBlur() {
    this.setCss('collapse', !this.input.value);
    this.setCss('focus', false);
  }

  setCss(css: string, on: boolean) {
    this.elementRef.nativeElement.classList.toggle(css, on);
  }

}
