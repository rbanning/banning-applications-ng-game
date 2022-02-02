import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Observable } from 'rxjs';

import { AuthService } from '@app/core';
import { AuthLoginFailed, IUser } from '@app/shared/models';

import { appValidators } from '@app/shared/common';
import { ToastService } from '@app/core/services/toast.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;  //initialized in OnInit
  loginError: AuthLoginFailed | null = null;
  working$: Observable<boolean>;
  private readonly AUTH_CODE = 'game';  //this should be in config but included here to show how one can use a code

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
    return this.loginForm.get(key) as FormControl;
  }

  submitLogin() {
    if (this.loginForm.value.code !== this.AUTH_CODE) {
      this.loginError = new AuthLoginFailed("Invalid login code!");
      return; //jump out!
    }
    //else
    this.loginError = null; //reset
    this.authService.login(
        this.loginForm.value.email, 
        this.loginForm.value.password)
      .subscribe({
        next: (result: IUser | null) => {
          if (result) {
            this.toastService.add({mode: 'success', text: `Welcome ${result.name}!`});
            this.router.navigate(['home']);
          } else {
            this.loginError = new AuthLoginFailed("Unable to log you in at this time");
          }
        },
        error: (err) => {
          if (err instanceof AuthLoginFailed) {
            this.loginError = err;
          } else {
            this.loginError = new AuthLoginFailed(err);
          }
        }
      });
  }



  private buildForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(appValidators.regex.email)]],
      password:[ '', [Validators.required]],
      code: ['', [Validators.required]]
    });
  }
}
