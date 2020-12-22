// Angular Imports
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

// Services
import { ListingsService } from '@app/services/listings.service';

// Interfaces
import { Listing } from '@app/interfaces/listing';
import { CategoryFilter, LocationFilter } from '@app/interfaces/filters';
import { locationsStore } from '@app/store/locations-store';
import { categoriesStore } from '@app/store/categories-store';

declare var $: any;

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  searchParams: FormGroup;
  locationsStore = locationsStore;
  categoriesStore = categoriesStore;
  popularSearchList: string[];
  resultsArr: Array<Listing>;
  resultsCount: string;
  resultsInputString: string;
  resultsCatString: string[];
  resultsLocString: string[];
  searchInput: string;
  catInput: string[];
  locInput: string[];

  constructor(public listingsService: ListingsService, private location: Location, private fb: FormBuilder) {
    this.searchParams = this.fb.group({
      nameParams: new FormControl(''),
      locationParams: new FormControl([]),
      categoryParams: new FormControl([]),
    });

    this.popularSearchList = ['Project Kampong', 'Rebuilding Homes', 'YOUTH Mentorship Programme', 'CommStart 2020'];

    this.resultsInputString = 'Everything';
    this.resultsCatString = ['All interests'];
    this.resultsLocString = ['All locations'];
  }

  ngOnInit() {
    this.searchInput = this.location.getState()['name'] ? this.location.getState()['name'] : '';
    this.catInput = this.location.getState()['category'] ? this.location.getState()['category'] : [];
    this.locInput = this.location.getState()['location'] ? this.location.getState()['location'] : [];
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
      this.listingsService.getSearchResult(keywords).subscribe((data) => {
        this.resultsArr = data['data'];
        this.resultsCount = data['data'].length;
        this.resultsInputString = this.searchInput.length > 0 ? this.searchInput : 'Everything';
        this.resultsLocString = this.locInput.length > 0 ? this.locInput : ['All locations'];
        this.resultsCatString = this.catInput.length > 0 ? this.catInput : ['All interests'];
      });
    } else {
      this.listingsService.getListings(1).subscribe((data) => {
        this.resultsArr = data['data'];
        this.resultsInputString = 'Everything';
        this.resultsLocString = ['All locations'];
        this.resultsCatString = ['All interests'];
      });
    }
  }

  concatKeywords(): string {
    const searchArray: string[] = this.searchInput.split(' ').filter((e) => e.length > 0);
    const resultArr: string[] = this.catInput.concat(this.locInput).concat(searchArray);
    let result: string = '';
    for (let i: number = 0; i < resultArr.length; i++) {
      result += resultArr[i] + '&';
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
