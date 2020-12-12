import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
  ValidationErrors,
} from "@angular/forms";

import { SnackbarService } from "@app/services/snackbar.service";

import { AuthService } from "@app/services/auth.service";
import { Router, ActivatedRoute } from "@angular/router";

function passwordValidator(control: FormControl) {
  let password = control.value;
  const containsNum = /\d/.test(password);
  var format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  var Capitalise = /[A-Z]/;
  if (!format.test(password) || !containsNum || !Capitalise.test(password)) {
    return {
      passwordChecker: {
        parsedPassword: password,
      },
    };
  }
  return null;
}

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
})
export class RegisterComponent implements OnInit {
  constructor(
    private router: Router,
    private fb: FormBuilder,
    public AuthService: AuthService,
    public SnackbarService: SnackbarService
  ) {}

  LoginForm: FormGroup;
  showCheckMail = false;
  registerError = false;
  showLoading = false;

  ngOnInit() {
    this.LoginForm = this.fb.group({
      first_name: ["", [Validators.maxLength(25), Validators.required]],
      last_name: ["", [Validators.maxLength(25), Validators.required]],
      email: ["", [Validators.email, Validators.required]],
      password: [
        "",
        [Validators.minLength(8), Validators.required, passwordValidator],
      ],
      confirmPassword: ["", [Validators.minLength(8)]],
      termsAndCondition: false,
    });

    this.AuthService.validRegisterResponse.subscribe(() => {
      this.showLoading = false;
      this.SnackbarService.openSnackBar(
        this.SnackbarService.DialogList.register.success,
        true,
      );
      this.router.navigate(["/onboarding"]);
    });
    this.AuthService.invalidRegisterResponse.subscribe(() => {
      this.showLoading = false;
      this.SnackbarService.openSnackBar(
        this.SnackbarService.DialogList.register.error,
        false,
      );
      // this.registerError = true;
    });
  }
  register() {
    if (this.LoginForm.value.termsAndCondition != true) {
      this.SnackbarService.openSnackBar(
        "Please accept the terms and conditions",
        false
      );
    } else {
      this.showLoading = true;
      this.AuthService.userRegister(this.LoginForm.value);
      this.LoginForm.reset();
    }
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
