import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { CookieService } from "ngx-cookie-service";
import { environment } from "./../../environments/environment";

// Interface
import { UserData } from "@app/interfaces/user";
import { API } from "@app/interfaces/api";
import { Observable } from "rxjs";
import { UserLoginData, UserRegisterData } from "@app/interfaces/auth";

interface OptionObject {
  headers: HttpHeaders;
  authorization?: string;
}

@Injectable({
  providedIn: "root",
})
export class AuthService {

  private url: string = environment.apiUrl;
  private userData: UserData = <UserData>{};
  private isLoggedIn: boolean = false;

  // Headers
  private options: OptionObject = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
    }),
  };

  private authOptions: OptionObject = <OptionObject>{};
  private authOptionsWithoutContentType: OptionObject = <OptionObject>{};

  constructor(
    private httpClient: HttpClient,
    private cookieService: CookieService
  ) {}

  /**
   * Register User
   * @param data User Details
   * @event POST
   */
  registerUser(data: UserRegisterData): Observable<API> {
    return this.httpClient.post<API>(
      this.url + "api/auth/register",
      data,
      this.options
    );
  }

  /**
   * Login User
   * @param data User Details
   * @event POST 
   */
  loginUser(data: UserLoginData): Observable<API> {
    return this.httpClient.post<API>(
      this.url + "api/auth/login",
      data,
      this.options
    )
  }
  
  /**
   * Private method which sets token
   */
  private setTokenInAuthOptions(token: string): void {
    this.authOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        authorization: "Bearer " + token,
      }),
    }
    this.authOptionsWithoutContentType = {
      headers: new HttpHeaders({
        authorization: "Bearer " + token,
      }),
    };
  }

  /**
   * Logout the current user
   */
  logoutUser(): void {
    this.cookieService.delete("token", "/");
    this.isLoggedIn = false;
    this.userData = <UserData>{};
    this.authOptions = <OptionObject>{};
    window.location.href = "/login";
  }

  /**
   * Get user details
   */
  getUserDataByToken(): Observable<API> {
    const token = this.cookieService.get("token");
    this.setTokenInAuthOptions(token);
    return this.httpClient.get<API>(
      this.url + "api/auth/me",
      this.authOptions
    )
  }

  /**
   * Get auth options for http headers
   */
  getAuthOptions(): OptionObject {
    return this.authOptions;
  }

  /**
   * Get auth options without content type for http headers
   */
  getAuthOptionsWithoutContentType(): OptionObject {
    return this.authOptionsWithoutContentType;
  }

  /**
   * Check cookie and set headers if it exists
   */
  checkCookieAndSetHeaders(): void {
    const token = this.cookieService.get("token");
    if (token && token !== null && token !== "") {
      this.setTokenInAuthOptions(token);
    }
  }

  /**
   * Check cookie if it exists
   */
  checkCookie(): boolean {
    const token = this.cookieService.get("token");
    return token && token!== null && token !== "";
  }

  /**
   * Deprecated
   */
  getIsLoggedIn(): boolean {
    return this.isLoggedIn;
  }

  /**
   * Deprecated
   */
  getUserData() {
    return this.userData;
  }
  
  /**
   * Deprecated
   */
  setUserData(userData: UserData): void {
    this.isLoggedIn = true;
    this.userData = userData;
  }

  /*
  
  userRegister(data) {
    return this.httpClient
      .post<API>(this.url + "api/auth/register", data, this.options)
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
      .post<API>(this.url + "api/auth/login", credentials, this.options)
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
      .get<API>(this.url + "api/auth/me", this.AuthOptions)
      .subscribe((data) => {
        console.log(data);
        this.UserData = data["data"];
        this.LoggedInUserID = this.UserData["user_id"];
        this.is_activated = this.UserData["is_activated"];
        this.isLoggedIn = true;
        this.LoginResponse.emit();
      });
  }
  getUserDetailsRegister() {
    return this.httpClient
      .get<API>(this.url + "api/auth/me", this.AuthOptions)
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
      this.url + "api/auth/updatepassword",
      data,
      this.AuthOptions
    );
  }
  */
}
