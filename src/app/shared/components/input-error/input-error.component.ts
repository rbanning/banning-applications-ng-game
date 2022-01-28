import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-input-error',
  templateUrl: './input-error.component.html',
  styleUrls: ['./input-error.component.css'],
})
export class InputErrorComponent implements OnInit {
  @Input()
  control!: FormControl | null;

  constructor() { }

  ngOnInit() {}

  invalid() {
    return this.control && this.control.touched && this.control.invalid;
  }

  message(): string[] | null {
    if (this.invalid()) {

      if (this.control?.errors) {
        const list: string[] = 
        Object.keys(this.control.errors).map(key => {
          //note: ts strict does not see that this.control.errors exists
          const error = (this.control?.errors || {})[key];
          switch (key.toLocaleLowerCase()) {
            case "required":
              return "this is required";
            case "max":
              if (typeof(error.max) === 'number') { return `must be less than or equal to ${error.max}`; }
              return "must be larger";
            case "maxlength":
              if (typeof(error.requiredLength) === 'number') { return `too long - no more than ${error.requiredLength} characters`; }
              return "too long";
            case "min":
              if (typeof(error.min) === 'number') { return `must be greater than or equal to ${error.min}`; }
              return "must be smaller";
            case "minlength":
              if (typeof(error.requiredLength) === 'number') { return `too short - must be at least ${error.requiredLength} characters`; }
              return "too short";
            case "email":
              return "invalid email address";
            case "pattern":
              return "invalid - this does not look right";

            //custom
            case "custom": 
              return error || 'invalid entry';
            case "integer":
              return error || "invalid - must be an integer";
            case "decimal":
              return error || "invalid - must be an decimal";
            case "positiveinteger":
              return error || "invalid - must be an integer greater than 0";
            case "nonnegativeinteger":
              return error || "invalid - must be an integer greater or equal to 0";
            case "nonempty":
              return "list cannot be empty";
            case "totalcharsmax":
              if (typeof(error.max) === 'number') { return `list cannot have more than ${error.max} characters`; }
              return "list is too long";
            default:
              return "invalid - please check your input";
            
          }
        });
      return list;
      }

      //else no information about the errors
      return ["invalid"]; //generic message 

      if (!this.control?.errors) { return ["invalid"]; } //generic message
      
      
    }

    return null;
  }
}
