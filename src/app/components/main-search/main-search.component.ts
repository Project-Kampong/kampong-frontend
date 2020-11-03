import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { locationList } from "@app/util/locations";
import { categoryList } from "@app/util/categories";
declare var $: any;

@Component({
  selector: "main-search",
  templateUrl: "./main-search.component.html",
  styleUrls: ["./main-search.component.scss"],
})
export class MainSearchComponent implements OnInit {

  searchParams: FormGroup;
  locationList: Object[];
  categoryList: Object[];

  constructor(
    private fb: FormBuilder, 
    private router: Router
  ) {
  
    this.locationList = locationList;
    this.categoryList = categoryList;

  }

  ngOnInit() {
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
