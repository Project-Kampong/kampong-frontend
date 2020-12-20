import { Component, OnInit } from '@angular/core';

import { AuthService } from '@app/services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { SnackbarService } from '@app/services/snackbar.service';

// Interface
import { UserLogin, UserLoginDefault } from '@app/interfaces/user';
import { uiStore } from '@app/store/ui-store';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(private AuthService: AuthService, private fb: FormBuilder, private router: Router, public SnackbarService: SnackbarService) {}

  loginCredentials: FormGroup;
  loginErrorMsg = false;
  uiStore = uiStore;

  ngOnInit() {
    this.loginCredentials = this.fb.group({
      ...UserLoginDefault,
    });

    this.AuthService.LoginResponse.subscribe(() => {
      this.SnackbarService.openSnackBar(this.SnackbarService.DialogList.login.success, true);
      this.router.navigate(['/home']);
    });
    this.AuthService.invalidLoginResponse.subscribe(() => {
      this.SnackbarService.openSnackBar(this.SnackbarService.DialogList.login.error, false);
    });
  }
  loginCheck() {
    uiStore.toggleLoading();

    // if (this.loginCredentials.value.email == '' || this.loginCredentials.value.password == '') {
    //   this.SnackbarService.openSnackBar(this.SnackbarService.DialogList.login.error, false);
    // } else {
    //   this.AuthService.userLogin(this.loginCredentials.value);
    // }
    // uiStore.toggleLoading();

    setTimeout(() => {
      if (this.loginCredentials.value.email == '' || this.loginCredentials.value.password == '') {
        this.SnackbarService.openSnackBar(this.SnackbarService.DialogList.login.error, false);
      } else {
        this.AuthService.userLogin(this.loginCredentials.value);
      }
      uiStore.toggleLoading();
    }, 2000);
  }
}
