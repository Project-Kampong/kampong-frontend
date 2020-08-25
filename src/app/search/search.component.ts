import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";

import { ListingsService } from "../services/listings.service";
import { AuthService } from "../services/auth.service";
import { Listing } from "../interfaces/listing";
declare var $: any;

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"],
})
export class SearchComponent implements OnInit {
  constructor(
    public ListingsService: ListingsService,
    public AuthService: AuthService,
    private location: Location
  ) {}

  resultsArr: Listing[];
  resultsCount: string;
  resultsString: string;
  searchInput: string;
  ngOnInit() {}
  goBack() {
    this.location.back();
  }
  searchInitiated() {
    console.log(this.searchInput);
    if (this.searchInput.length > 0) {
      this.ListingsService.getSearchResult(this.searchInput).subscribe(
        (data) => {
          this.resultsArr = data["data"];
          this.resultsCount = data["data"].length;
          this.resultsString = this.searchInput;
        }
      );
    }
  }
}
