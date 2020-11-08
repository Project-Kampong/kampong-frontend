import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";

import { ListingsService } from "@app/services/listings.service";
import { AuthService } from "@app/services/auth.service";
import { Listing } from "@app/interfaces/listing";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { locationList } from "@app/util/locations";
import { categoryList } from "@app/util/categories";
import { CategoryFilter, LocationFilter } from '@app/interfaces/filters';
declare var $: any;

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"],
})

export class SearchComponent implements OnInit {

  searchParams: FormGroup;
  locationList: Array<LocationFilter>;
  categoryList: Array<CategoryFilter>;
  popularSearchList: string[];
  resultsArr: Array<Listing>;
  resultsCount: string;
  resultsInputString: string;
  resultsCatString: string[];
  resultsLocString: string[];
  searchInput: string;
  catInput: string[];
  locInput: string[];

  constructor(
    public ListingsService: ListingsService,
    public AuthService: AuthService,
    private location: Location,
    private fb: FormBuilder,
  ) {

    this.searchParams = this.fb.group({
      nameParams: new FormControl(""),
      locationParams: new FormControl([]),
      categoryParams: new FormControl([])
    })

    this.popularSearchList = [
      "Project Kampong",
      "Rebuilding Homes",
      "YOUTH Mentorship Programme",
      "CommStart 2020",
    ];

    this.resultsInputString = "Everything";
    this.resultsCatString = ["All interests"];
    this.resultsLocString = ["All locations"];

  }

  ngOnInit() {
    this.locationList = locationList;
    this.categoryList = categoryList;
    this.searchInput = this.location.getState()["name"] ? this.location.getState()["name"] : "";
    this.catInput = this.location.getState()["category"] ? this.location.getState()["category"] : [];
    this.locInput = this.location.getState()["location"] ? this.location.getState()["location"] : [];
    this.searchInput.trim();
    this.search();
  }

  goBack(): void {
    this.location.back();
  }

  inputSearch(): void {
    this.filterSearch();
    this.search();
  }

  filterSearch(): void {
    this.searchInput.trim();
    this.catInput = this.searchParams.value.categoryParams ? this.searchParams.value.categoryParams : [];
    this.locInput = this.searchParams.value.locationParams ? this.searchParams.value.locationParams : [];
  }

  search(): void {
    if (this.searchInput.length > 0 || this.catInput.length > 0 || this.locInput.length > 0) {
      const keywords = this.concatKeywords();
      this.ListingsService.getSearchResult(keywords).subscribe(
        (data) => {
          this.resultsArr = data["data"];
          this.resultsCount = data["data"].length;
          this.resultsInputString = this.searchInput.length > 0 ? this.searchInput : "Everything";
          this.resultsLocString = this.locInput.length > 0 ? this.locInput : ["All locations"];
          this.resultsCatString = this.catInput.length > 0 ? this.catInput : ["All interests"];
        }
      );
    } else {
      this.ListingsService.getListings(1).subscribe((data) => {
        this.resultsArr = data["data"];
        this.resultsInputString = "Everything";
        this.resultsLocString = ["All locations"];
        this.resultsCatString = ["All interests"];
      })
    }
  }
  
  concatKeywords(): string {
    const searchArray = this.searchInput.split(' ').filter(e => e.length > 0);;
    const resultArr = this.catInput.concat(this.locInput).concat(searchArray);
    let result = '';
    for (let i = 0; i < resultArr.length; i++) {
      result += resultArr[i];
      result += '&'
    }
    return result;
  }

  popularSearchClicked(value: string): void {
    this.searchParams.reset();
    this.searchInput = value;
    this.locInput = [];
    this.catInput = [];
    this.search();
  }

}
