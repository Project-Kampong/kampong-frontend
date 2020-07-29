import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";

import { Listing, DefaultListing } from "../interfaces/listing";

@Injectable({
  providedIn: "root",
})
export class ListingsService {
  constructor(private httpClient: HttpClient) {}

  // URL
  url = "http://165.22.103.155/";

  httpHeaders = new HttpHeaders({
    "Content-Type": "application/json",
  });
  options = {
    headers: this.httpHeaders,
  };

  // Variables
  ListingData: Listing[];

  getListings() {
    return this.httpClient
      .get(this.url + "api/listings", this.options)
      .subscribe((data) => {
        this.ListingData = data["data"];
      });
  }

  getSelectedListing(listingId) {
    return this.httpClient.get(
      this.url + "api/listings/" + listingId,
      this.options
    );
  }

  getUserProfile(userId) {
    return this.httpClient.get(
      this.url + "api/profiles/" + userId,
      this.options
    );
  }
}
