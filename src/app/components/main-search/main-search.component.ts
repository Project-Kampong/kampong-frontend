// Angular Imports
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { locationList } from "@app/util/locations";
import { categoryList } from "@app/util/categories";
import { CategoryFilter, LocationFilter } from '@app/interfaces/filters';
declare var $: any;

@Component({
  selector: "main-search",
  templateUrl: "./main-search.component.html",
  styleUrls: ["./main-search.component.scss"],
})
export class MainSearchComponent implements OnInit {

  searchParams: FormGroup;
  locationList: Array<LocationFilter>;
  categoryList: Array<CategoryFilter>;

  constructor(
    private fb: FormBuilder, 
    private router: Router
  ) {}

  ngOnInit() {
    this.locationList = locationList;
    this.categoryList = categoryList;
    this.searchParams = this.fb.group({
      nameParams: new FormControl(""),
      locationParams: new FormControl([]),
      categoryParams: new FormControl([]),
    });
  }

  initiateSearch() {
    this.router.navigate(["/search"], {
      state: { 
        name: this.searchParams.value.nameParams,
        location: this.searchParams.value.locationParams,
        category: this.searchParams.value.categoryParams,
      },
    });
  }
}
