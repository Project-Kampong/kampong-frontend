import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";

import { Listing, DefaultListing } from "../interfaces/listing";

// Services Import
import { AuthService } from "../services/auth.service";
@Injectable({
  providedIn: "root",
})
export class ListingsService {
  constructor(
    private httpClient: HttpClient,
    private AuthService: AuthService
  ) {}

  // URL
  url = this.AuthService.URL;

  httpHeaders = new HttpHeaders({
    "Content-Type": "application/json",
  });
  options = {
    headers: this.httpHeaders,
  };

  // Variables
  ListingData: Listing[];
  FeaturedListingData: Listing[];

  getListings() {
    return this.httpClient
      .get(this.url + "api/listings", this.options)
      .subscribe((data) => {
        this.ListingData = data["data"];
        console.log(this.ListingData);
        this.FeaturedListingData = data["data"];
      });
  }

  getSelectedListing(listingId) {
    return this.httpClient.get(
      this.url + "api/listings/" + listingId,
      this.options
    );
  }

  // Listing FAQ
  getSelectedListingFAQ(listingId) {
    return this.httpClient.get(
      this.url + "api/listings/" + listingId + "/faqs",
      this.options
    );
  }

  // Listing Skills
  getSelectedListingSkills(listingId) {
    return this.httpClient.get(
      this.url + "api/listings/" + listingId + "/skills",
      this.options
    );
  }

  // Liked Listing - by User
  getLikedListing() {
    return this.httpClient.get(
      this.url + "api/profiles/" + this.AuthService.LoggedInUserID + "/likes",
      this.options
    );
  }
}
