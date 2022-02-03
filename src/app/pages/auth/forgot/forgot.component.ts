import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';

import { AuthService, ToastService } from '@app/core/services';
import { appValidators, generateHash } from '@app/shared/common';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.css']
})
export class ForgotComponent implements OnInit {
  forgotForm!: FormGroup;  //initialized in OnInit
  forgotError: string | null = null;
  working$: Observable<boolean>;

  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private fb: FormBuilder,
    private router: Router
  ) { 
    if (this.authService.isAuthenticated()) {
      this.authService.logout();
    }
    this.working$ = this.authService.working$();
  }

  ngOnInit(): void {
    this.buildForm();
  }

  getCtrl(key: string): FormControl | null {
    return this.forgotForm.get(key) as FormControl;
  }

  submit() {
    this.forgotError = null; //reset
    if (this.forgotForm.valid) {
      const password =  btoa(`${generateHash(this.forgotForm.value.email)}`); //create some crazy password
      this.toastService.add({mode: 'success', text: `Successfully reset your password to ${password}!`, delay: 0});
      this.router.navigate(['/auth', 'login']);
    } else {
      this.forgotError = "Unable to reset your password at this time";
    }
  }



  private buildForm() {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(appValidators.regex.email)]],
    });
  }


}
