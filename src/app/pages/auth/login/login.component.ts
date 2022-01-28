import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  submitLogin() {
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
      password:[ '', [Validators.required]]
    });
  }
}
