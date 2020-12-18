import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, ValidationErrors } from "@angular/forms";

import { SnackbarService } from "@app/services/snackbar.service";

import { AuthService } from "@app/services/auth.service";
import { Router } from "@angular/router";
import { UserRegisterData } from "@app/interfaces/auth";
import { Subscription } from "rxjs";
import { CookieService } from "ngx-cookie-service";
import { registerForm } from "@app/util/forms/register";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
})
export class RegisterComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];
  
  constructor(
    private router: Router,
    private fb: FormBuilder,
    public authService: AuthService,
    public snackbarService: SnackbarService,
    private cookieService: CookieService
  ) {}

  registerForm: FormGroup;
  //showCheckMail = false;
  //registerError = false;
  showLoading: boolean = false;

  ngOnInit() {
    this.registerForm = this.fb.group(registerForm);
  }

  registerUser(data: UserRegisterData): void {
    //check input
    this.showLoading = true;
    this.subscriptions.push(this.authService.registerUser(data).subscribe(
      (res) => {
        this.cookieService.set("token", res["token"]);
        this.authService.setUserDetails();
        this.snackbarService.openSnackBar(this.snackbarService.DialogList.register.success, true);
      },
      (err) => {
        console.log(err);
        this.snackbarService.openSnackBar(this.snackbarService.DialogList.register.error, false);
      },
      () => {
        this.showLoading = false;
        this.router.navigate(["/onboarding"]);
      }
    ))
  }

  getFormValidationErrors(): boolean {
    Object.keys(this.registerForm.controls).forEach((key) => {
      const controlErrors: ValidationErrors = this.registerForm.get(key).errors;
      if (controlErrors !== null) {
        return true;
      }
    });
    if (!this.checkPassword()) {
      return true;
    }
    return false;
  }

  checkPassword(): boolean {
    return this.registerForm.value.password === this.registerForm.value.confirmPassword;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
