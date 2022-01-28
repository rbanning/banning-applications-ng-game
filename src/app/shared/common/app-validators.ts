import { AbstractControl } from '@angular/forms';

export type ValidationResult = {[key: string]: string} | null;

const validateInteger = (key: string, value: any, min: number | null = null, max: number | null = null) => {
  const result = (message: string | null = null) => {
    if (!message) {
      message = 'expecting an integer';
      if (min !== null) { message += ` greater than or equal to ${min}`; }
      if (max !== null) { message += ` ${min !== null ? 'and ' : ''} less than or equal to ${max}`; }
    }
    const ret: ValidationResult = {};
    ret[key] = message;

    return ret;
  };

  const testNumber = (num: number) => {
    if ((typeof(num) !== 'number') || !Number.isInteger(num)) { return result('expecting an integer'); }
    else if (min !== null && num < min) { return result(); }
    else if (max !== null && num > max) { return result(); }
    //else
    return null;
  };

  if (typeof(value) === 'number') {
    return testNumber(value);
  } else if (typeof(value) === 'string' && value.length > 0) {
    const num = parseInt(value, 10);
    if (isNaN(num) || `${num}` !== value) {
       return result("expecting a valid integer");
    }
    //else
    return testNumber(num);
  }

  //else
  return null;
};


const validateDecimal = (key: string, value: any, min: number | null = null, max: number | null = null) => {
  const result = (message: string | null = null) => {
    if (!message) {
      message = 'expecting an number';
      if (min !== null) { message += ` greater than or equal to ${min}`; }
      if (max !== null) { message += ` ${min !== null ? 'and ' : ''} less than or equal to ${max}`; }
    }
    const ret: ValidationResult = {};
    ret[key] = message;

    return ret;
  };

  const testNumber = (num: number) => {
    if ((typeof(num) !== 'number') || !Number.isFinite(num)) { return result("expecting a number"); }
    else if (min !== null && num < min) { return result(); }
    else if (max !== null && num > max) { return result(); }

    //else
    return null;
  };

  if (typeof(value) === 'number') {
    return testNumber(value);
  } else if (typeof(value) === 'string' && value.length > 0) {
    const num = parseFloat(value);
    const re = /^(\-)?\d*(\.)?\d*$/;
    if (isNaN(num) || !re.test(value)) {
       return result("expecting a valid number");
    }
    //else
    return testNumber(num);
  }

  //else
  return null;
};


export const appValidators = {
  regex: {
    url: '^(https?://)?([\\dA-Za-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?',
    // phone: '/^\\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/',
    phone: '\\(?([0-9]{3})\\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})',
    phoneWithExtension: '\\(?([0-9]{3})\\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})( x[0-9]*)?',
    email: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,3}$',
    name: '[a-zA-Z ]+[a-zA-Z ]',
    emailCode: '[a-zA-Z]',
    // password: '(?:(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\\W).*)'
    // password: '(?:(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[-+_!@#$%^&*.,?]).*)'
    password: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{7,}$/ // lowercase, uppercase, digit, at least 7 chars long
  },
  integer: (min: number | null = null, max: number | null = null) => {
    return (control: AbstractControl) => {
      return validateInteger('integer', control.value, min, max);
    };
  },
  posInteger: (control: AbstractControl) => {
    return validateInteger('posInteger', control.value, 1);
  },
  nonNegativeInteger: (control: AbstractControl) => {
    return validateInteger('nonNegativeInteger', control.value, 0);
  },
  decimal: (min: number | null = null, max: number | null = null) => {
    return (control: AbstractControl) => {
      return validateDecimal('decimal', control.value, min, max);
    };
  },
  password: (control: AbstractControl) => {
    if (control.value) {
      //check length
      if (control.value.length < appValidators.minLength.password) {
        return { password: `Too Short - must be be at least ${appValidators.minLength.password} chars long.`};
      }
      //check regex
      if (!control.value.match(appValidators.regex.password)) {
        return {password: 'Must include lowercase, upper case and a digit'};
      }
    }

    //else
    return null;
  },
  equalsControl: (controlKey: string, controlName: string | null = null, ignoreCase: boolean = false) => {
    return (control: AbstractControl) => {
      if (control && control.parent) {
        controlName = controlName || controlKey;
        const value: string = control.value;
        const ctrl = control.parent.get(controlKey);
        const ctrlValue: string = ctrl?.value;
        if (ctrl && (ctrlValue || value)) {
          if (ignoreCase) {
            return ctrlValue.toLocaleUpperCase() === value.toLocaleUpperCase() ? null : { equals: controlName };
          } else {
            return ctrlValue === value ? null : { equals: controlName };
          }
        }
      }
      //else
      return null;
    };
  },
  lists: {
    nonEmpty: (control: AbstractControl) => {
      if (!control.value && !Array.isArray(control.value) && control.value.length === 0) {
        return { nonEmpty: true };
      }
      //else
      return null;
    },
    totalCharsMax: (max: number) => {
      return (control: AbstractControl) => {
        if (Array.isArray(control.value)) {
          const total = control.value.reduce((sum: number, text: string) => {
            sum += !!text ? text.length : 0;
          }, 0);

          if (total > max) {
            return { totalCharsMax: {max, total} };
          }
        }
        //else
        return null;
      };
    }
  },
  maxLength: {
    string: 100,   //general string
    shortString: 50,   //general string
    extraShortString: 20, //general string
    longString: 1000,   //general string
    name: 1000,   //why???
    email: 250,
    phone: 20,    //allows for separators
    combined_address: 500,
    address: 100,
    city: 100,
    st: 2,
    zip: 10,
    listTotal: 1000,
    notes: 200
  },
  minLength: {
    password: 7
  }
};
