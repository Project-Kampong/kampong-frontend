import { Component, OnDestroy, OnInit } from "@angular/core";

import { AuthService } from '@app/services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { SnackbarService } from '@app/services/snackbar.service';

// Interface
import { Subscription } from "rxjs";
import { CookieService } from "ngx-cookie-service";
import { userLoginForm } from "@app/util/forms/login";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private snackbarService: SnackbarService,
    private cookieService: CookieService,
  ) {}

  loginCredentials: FormGroup;
  loginErrorMsg = false;

  ngOnInit() {

    this.loginCredentials = this.fb.group({
      ...userLoginForm,
    });
  }

  loginUser(): void {
    
    const loginDetails = this.loginCredentials.value;

    this.subscriptions.push(this.authService.loginUser(loginDetails).subscribe(
      (res) => {
        this.cookieService.set("token", res["token"]);
        this.snackbarService.openSnackBar(this.snackbarService.DialogList.login.success, true);
      },
      (err) => {
        console.log(err);
        this.snackbarService.openSnackBar(this.snackbarService.DialogList.login.error, false);
      },
      () => {
        this.router.navigate(["/home"]);
      }
    ))
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /*
  loginCheck() {
    if (
      this.loginCredentials.value.email == "" ||
      this.loginCredentials.value.password == ""
    ) {
      this.SnackbarService.openSnackBar(
        this.SnackbarService.DialogList.login.error,
        false
      );
    } else {
      this.authService.userLogin(this.loginCredentials.value);
    }
  }
  */
}
