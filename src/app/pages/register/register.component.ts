import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  ValidationErrors,
} from "@angular/forms";

import { SnackbarService } from "@app/services/snackbar.service";

import { AuthService } from "@app/services/auth.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
})
export class RegisterComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    public AuthService: AuthService,
    public SnackbarService: SnackbarService
  ) {}

  LoginForm: FormGroup;
  showCheckMail = false;
  registerError = false;

  ngOnInit() {
    this.LoginForm = this.fb.group({
      first_name: ["", [Validators.maxLength(10), Validators.required]],
      last_name: ["", [Validators.maxLength(10), Validators.required]],
      email: ["", [Validators.email, Validators.required]],
      password: ["", [Validators.minLength(6), Validators.required]],
      confirmPassword: ["", [Validators.minLength(6)]],
    });

    this.AuthService.validRegisterResponse.subscribe(() => {
      this.showCheckMail = true;
      this.SnackbarService.openSnackBar(
        this.SnackbarService.DialogList.register.success,
        true
      );
    });
    this.AuthService.invalidRegisterResponse.subscribe(() => {
      this.SnackbarService.openSnackBar(
        this.SnackbarService.DialogList.register.error,
        false
      );
      // this.registerError = true;
    });
  }
  register() {
    this.AuthService.userRegister(this.LoginForm.value);
    this.LoginForm.reset();
  }

  getFormValidationErrors() {
    var error = false;
    Object.keys(this.LoginForm.controls).forEach((key) => {
      const controlErrors: ValidationErrors = this.LoginForm.get(key).errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach((keyError) => {
          error = true;
        });
      }
    });
    if (this.LoginForm.value.password != this.LoginForm.value.confirmPassword) {
      error = true;
    }
    return error;
  }

  checkPassword() {
    var error = false;
    if (this.LoginForm.value.password != this.LoginForm.value.confirmPassword) {
      error = true;
    }
    return error;
  }
}
