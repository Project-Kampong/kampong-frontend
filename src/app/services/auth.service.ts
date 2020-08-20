import { Injectable, EventEmitter } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { CookieService } from "ngx-cookie-service";
import { environment } from "./../../environments/environment";

// Interface
import { UserData } from "../interfaces/user";
@Injectable({
  providedIn: "root",
})
export class AuthService {
  LoginResponse = new EventEmitter<void>();

  public URL = environment.apiUrl;
  public isLoggedIn = false;
  public AuthToken;
  private UserData: UserData[];
  public LoggedInUserID;

  // Headers
  httpHeaders = new HttpHeaders({
    "Content-Type": "application/json",
  });
  options = {
    headers: this.httpHeaders,
  };
  AuthHttpHeaders;
  AuthOptions;
  // Containers only token - No content type
  OnlyAuthHttpHeaders;

  constructor(
    private httpClient: HttpClient,
    private CookieService: CookieService
  ) {}

  userRegister(data) {
    return this.httpClient
      .post(this.URL + "api/auth/register", data, this.options)
      .subscribe(
        (res) => {
          console.log(res);
        },
        (err) => {
          return false;
        }
      );
  }

  userLogin(credentials) {
    return this.httpClient
      .post(this.URL + "api/auth/login", credentials, this.options)
      .subscribe(
        (res) => {
          this.AuthToken = res["token"];
          this.setAuthHeaders(this.AuthToken);
          this.CookieService.set("token", this.AuthToken);
          this.getUserDetails();
        },
        (err) => {
          return false;
        }
      );
  }
  getUserDetails() {
    return this.httpClient
      .get(this.URL + "api/auth/me", this.AuthOptions)
      .subscribe((data) => {
        console.log(data);
        this.UserData = data["data"];
        this.LoggedInUserID = this.UserData["user_id"];
        this.isLoggedIn = true;
        this.LoginResponse.emit();
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
    const tokenExist = this.CookieService.get("token");
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
    this.CookieService.delete("token", "/");
    window.location.href = "/login";
  }

  // Update Password
  updatePassword(data) {
    return this.httpClient.put(
      this.URL + "api/auth/updatepassword",
      data,
      this.AuthOptions
    );
  }
}
