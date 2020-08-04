import { Component, OnInit } from "@angular/core";

import { AuthService } from "../services/auth.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";

// Interface
import { UserLogin, UserLoginDefault } from "../interfaces/user";

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

  ngOnInit() {
    this.loginCredentials = this.fb.group({
      ...UserLoginDefault,
    });

    this.AuthService.LoginResponse.subscribe(() => {
      this.router.navigate(["/home"]);
    });
  }
  loginCheck() {
    console.log("clicked");
    this.AuthService.userLogin(this.loginCredentials.value);
  }
}
