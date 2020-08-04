import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { AuthService } from "../services/auth.service";

@Injectable({
  providedIn: "root",
})
export class ProfileService {
  constructor(
    private httpClient: HttpClient,
    private AuthService: AuthService
  ) {}

  url = this.AuthService.URL;

  options = this.AuthService.options;
  AuthOptions = this.AuthService.AuthOptions;

  getUserProfile(userId) {
    return this.httpClient.get(
      this.url + "api/profiles/" + userId,
      this.options
    );
  }

  getPublicLikes(userId) {
    return this.httpClient.get(
      this.url + "api/profiles/" + userId + "/likes",
      this.options
    );
  }

  // Write
  updateUserProfile(userId, data) {
    return this.httpClient.put(
      this.url + "api/profiles/" + userId,
      data,
      this.AuthOptions
    );
  }
}
