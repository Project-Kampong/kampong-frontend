import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

import { AuthService } from "../services/auth.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
})
export class RegisterComponent implements OnInit {
  constructor(private fb: FormBuilder, public AuthService: AuthService) {}

  LoginForm: FormGroup;

  ngOnInit() {
    this.LoginForm = this.fb.group({
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  }
  register() {
    console.log(this.LoginForm.value);
    this.AuthService.userRegister(this.LoginForm.value);
  }
}
