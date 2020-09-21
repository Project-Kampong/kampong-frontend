import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";

import { ListingsService } from "@app/services/listings.service";
import { AuthService } from "@app/services/auth.service";
import { Listing } from "@app/interfaces/listing";
import { Router } from "@angular/router";
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
    private location: Location,
    private router: Router
  ) {}

  resultsArr: Listing[];
  resultsCount: string;
  resultsInputString: string = "Everything";
  resultsCatString: string[] = ["All interests"];
  resultsLocString: string[] = ["All locations"];
  searchInput: string;
  catInput: string[];
  locInput: string[];

  popularSearchList = [
    "Project Kampong",
    "Rebuilding Homes",
    "YOUTH Mentorship Programme",
    "CommStart 2020",
  ];
  ngOnInit() {
    this.searchInput = this.location.getState()["name"] ? this.location.getState()["name"] : "";
    this.catInput = this.location.getState()["category"] ? this.location.getState()["category"] : [];
    this.locInput = this.location.getState()["location"] ? this.location.getState()["location"] : [];
    this.searchInitiated();
  }
  goBack() {
    this.location.back();
  }
  searchInitiated() {
    this.searchInput.trim();
    if (this.searchInput.length > 0 || this.catInput.length > 0 || this.locInput.length > 0) {
      const keywords = this.concatKeywords();
      console.log(keywords);
      this.ListingsService.getSearchResult(keywords).subscribe(
        (data) => {
          this.resultsArr = data["data"];
          this.resultsCount = data["data"].length;
          this.resultsInputString = this.searchInput.length > 0 ? this.searchInput : this.resultsInputString;
          this.resultsLocString = this.locInput.length > 0 ? this.locInput : this.resultsLocString;
          this.resultsCatString = this.catInput.length > 0 ? this.catInput : this.resultsCatString;

        }
      );
    }
  }
  
  concatKeywords() {
    const searchArray = this.searchInput.split(' ').filter(e => e.length > 0);;
    const resultArr = this.catInput.concat(this.locInput).concat(searchArray);
    let result = '';
    for (let i = 0; i < resultArr.length; i++) {
      result += resultArr[i];
      result += '&'
    }
    return result;
  }

  popularSearchClicked(value) {
    this.searchInput = value;
    this.searchInitiated();
  }
}
