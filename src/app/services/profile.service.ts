import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AuthService } from "@app/services/auth.service";
import { environment } from "src/environments/environment";

import { API } from "@app/interfaces/api";
import { Observable } from "rxjs";

interface OptionObject {
  headers: HttpHeaders;
  authorization?: string;
}

@Injectable({
  providedIn: "root",
})
export class ProfileService {
  constructor(
    private httpClient: HttpClient,
    private AuthService: AuthService
  ) {}

  private url: string = environment.apiUrl;

  private options: OptionObject = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
    }),
  };

  /**
   * Get a particular user profile
   * @param userId User ID
   */
  getUserProfile(userId: string) {
    return this.httpClient.get<API>(
      this.url + "api/users/" + userId + "/profiles",
      this.options
    );
  }

  /**
   * Get all liked listings for a particular user
   * @param userId User ID
   */
  getPublicLikes(userId: string) {
    return this.httpClient.get<API>(
      this.url + "api/users/" + userId + "/likes",
      this.options
    );
  }

  /**
   * Updates user profile data
   * @param userId User ID
   * @param data Updated Profile Data
   * @param headers authOptions 
   */
  updateUserProfile(userId: string, data, headers: OptionObject) {
    return this.httpClient.put<API>(
      this.url + "api/users/" + userId + "/profiles",
      data,
      headers
    );
  }

  /**
   * Deprecated
   * @param userId User ID
   * @param data ProfileData
   * @param headers authOptionsWithoutContentType
   */
  updateUserProfilePic(userId: string, data, headers) {
    return this.httpClient.put<API>(
      this.url + "api/users/" + userId + "/profiles/upload-photo",
      data,
      headers
    );
  }

  /**
   * Gets all listings owned by user
   * @param userId User ID
   * @event GET
   */
  getPublicOwnedListings(userId: string): Observable<API> {
    return this.httpClient.get<API>(
      this.url + "api/users/" + userId + "/listings/owner",
      this.options
    );
  }

  
}
