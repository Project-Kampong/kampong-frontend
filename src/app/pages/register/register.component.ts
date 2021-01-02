import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, ValidationErrors } from '@angular/forms';

import { SnackbarService } from '@app/services/snackbar.service';

import { AuthService } from '@app/services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { registerForm } from '@app/util/forms/register';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private snackbarService: SnackbarService,
    private cookieService: CookieService,
  ) {}

  registerForm: FormGroup;
  showLoading: boolean = false;

  ngOnInit() {
    this.registerForm = this.fb.group({ ...registerForm });
  }

  registerUser(): void {
    this.showLoading = true;
    this.subscriptions.push(
      this.authService.registerUser(this.registerForm.value).subscribe(
        (res) => {
          this.cookieService.set('token', res['token']);
          this.snackbarService.openSnackBar(this.snackbarService.DialogList.register.success, true);
        },
        (err) => {
          console.log(err);
          this.snackbarService.openSnackBar(err.error.error, false);
          // this.snackbarService.openSnackBar(this.snackbarService.DialogList.register.error, false);
          this.showLoading = false;
        },
        () => {
          this.showLoading = false;
          this.router.navigate(['/onboarding']);
        },
      ),
    );
  }

  getFormValidationErrors(): boolean {
    if (this.registerForm.controls.first_name.errors !== null) {
      return true;
    }
    if (this.registerForm.controls.last_name.errors !== null) {
      return true;
    }
    if (this.registerForm.controls.nick_name.errors !== null) {
      return true;
    }
    if (this.registerForm.controls.email.errors !== null) {
      return true;
    }
    if (this.checkPassword()) {
      return true;
    }
    if (this.registerForm.controls.termsAndCondition.errors !== null) {
      return true;
    }
    return false;
  }

  checkPassword(): boolean {
    return !(this.registerForm.value.password === this.registerForm.value.confirmPassword);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
