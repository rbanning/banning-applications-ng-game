import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@app/core';
import { ToastService } from '@app/core/services/toast.service';
import { appValidators } from '@app/shared/common';
import { IUser, AuthLoginFailed } from '@app/shared/models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;  //initialized in OnInit
  registerError: string | null = null;
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
    return this.registerForm.get(key) as FormControl;
  }

  submit() {
    this.registerError = null; //reset
    if (this.registerForm.valid) {
      this.toastService.add({mode: 'success', text: `Successfully registered ${this.registerForm.value.email}!`});
      this.router.navigate(['/auth', 'login']);
    } else {
      this.registerError = "Unable to register you at this time";
    }
  }



  private buildForm() {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(appValidators.regex.email)]],
      password:[ '', [Validators.required, appValidators.password]],
    });
  }

}
