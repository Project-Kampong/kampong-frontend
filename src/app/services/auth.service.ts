import { Injectable, EventEmitter } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { CookieService } from "ngx-cookie-service";
import { environment } from "./../../environments/environment";
import { UserData } from "@app/interfaces/user";
import { API } from "@app/interfaces/api";
import { UserRegisterData } from "@app/interfaces/auth";

@Injectable({
  providedIn: "root",
})
export class AuthService {

  loginResponse = new EventEmitter<void>();
  invalidLoginResponse = new EventEmitter<void>();
  invalidRegisterResponse = new EventEmitter<void>();
  validRegisterResponse = new EventEmitter<void>();

  private URL = environment.apiUrl;
  private isLoggedIn = false;
  private is_activated = false;
  private AuthToken;
  private UserData: UserData[];
  private LoggedInUserID;

  // Headers
  httpHeaders = new HttpHeaders({
    "Content-Type": "application/json",
  });
  options = {
    headers: this.httpHeaders,
  };
  AuthHttpHeaders;
  AuthOptions;
  OnlyAuthHttpHeaders;

  Dialogmessage: string = "";

  constructor(private httpClient: HttpClient, private cookieService: CookieService) {}

  userRegister(data: UserRegisterData) {
    return this.httpClient
      .post<API>(this.URL + "api/auth/register", data, this.options)
      .subscribe(
        (res) => {
          this.validRegisterResponse.emit();
          this.AuthToken = res["token"];
          this.setAuthHeaders(this.AuthToken);
          this.cookieService.set("token", this.AuthToken);
          this.getUserDetailsRegister();
        },
        (err) => {
          this.invalidRegisterResponse.emit();
        }
      );
  }

  userLogin(credentials) {
    return this.httpClient
      .post<API>(this.URL + "api/auth/login", credentials, this.options)
      .subscribe(
        (res) => {
          this.AuthToken = res["token"];
          this.setAuthHeaders(this.AuthToken);
          this.cookieService.set("token", this.AuthToken);
          this.getUserDetails();
        },
        (err) => {
          this.invalidLoginResponse.emit();
          return false;
        }
      );
  }
  getUserDetails() {
    return this.httpClient
      .get<API>(this.URL + "api/auth/me", this.AuthOptions)
      .subscribe((data) => {
        console.log(data);
        this.UserData = data["data"];
        this.LoggedInUserID = this.UserData["user_id"];
        this.is_activated = this.UserData["is_activated"];
        this.isLoggedIn = true;
        this.loginResponse.emit();
      });
  }
  getUserDetailsRegister() {
    return this.httpClient
      .get<API>(this.URL + "api/auth/me", this.AuthOptions)
      .subscribe((data) => {
        console.log(data);
        this.UserData = data["data"];
        this.LoggedInUserID = this.UserData["user_id"];
        this.is_activated = this.UserData["is_activated"];
        this.isLoggedIn = true;
        this.validRegisterResponse.emit();
      });
  }

  setAuthHeaders(token) {
    const authorizationCode = "Bearer " + token;
    this.AuthHttpHeaders = new HttpHeaders({
      "Content-Type": "application/json",
      authorization: authorizationCode,
    });

    this.AuthOptions = {
      headers: this.AuthHttpHeaders,
    };

    this.OnlyAuthHttpHeaders = {
      headers: new HttpHeaders({
        authorization: authorizationCode,
      }),
    };
  }

  // Find token in cookies
  tokenExist() {
    const tokenExist = this.cookieService.get("token");
    if (tokenExist != null && tokenExist != "") {
      this.AuthToken = tokenExist;
      this.setAuthHeaders(tokenExist);
      this.getUserDetails();
    }
  }

  logout() {
    console.log("logout");
    this.AuthToken = "";
    this.isLoggedIn = false;
    this.cookieService.delete("token", "/");
    window.location.href = "/login";
  }

  // Update Password
  updatePassword(data) {
    return this.httpClient.put<API>(
      this.URL + "api/auth/updatepassword",
      data,
      this.AuthOptions
    );
  }
}
