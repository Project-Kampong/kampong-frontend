import { Component, OnInit } from "@angular/core";

import { AuthService } from "@app/services/auth.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";

// Interface
import { UserLogin, UserLoginDefault } from "@app/interfaces/user";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  constructor(
    private AuthService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  loginCredentials: FormGroup;
  loginErrorMsg = false;
  ngOnInit() {
    this.loginCredentials = this.fb.group({
      ...UserLoginDefault,
    });

    this.AuthService.LoginResponse.subscribe(() => {
      this.router.navigate(["/home"]);
    });
    this.AuthService.invalidLoginResponse.subscribe(() => {
      console.log("invalid login");
      this.loginErrorMsg = true;
    });
  }
  loginCheck() {
    if (
      this.loginCredentials.value.email == "" ||
      this.loginCredentials.value.password == ""
    ) {
      this.loginErrorMsg = true;
    } else {
      this.AuthService.userLogin(this.loginCredentials.value);
    }
  }
}
