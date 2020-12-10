// Angular Imports
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { locationsStore } from '@app/store/locations-store';
import { categoriesStore } from '@app/store/categories-store';
declare var $: any;

@Component({
  selector: 'main-search',
  templateUrl: './main-search.component.html',
  styleUrls: ['./main-search.component.scss'],
})
export class MainSearchComponent implements OnInit {
  searchParams: FormGroup;
  locationsStore = locationsStore;
  categoriesStore = categoriesStore;

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit() {
    this.searchParams = this.fb.group({
      nameParams: new FormControl(''),
      locationParams: new FormControl([]),
      categoryParams: new FormControl([]),
    });
  }

  initiateSearch() {
    this.router.navigate(['/search'], {
      state: {
        name: this.searchParams.value.nameParams,
        location: this.searchParams.value.locationParams,
        category: this.searchParams.value.categoryParams,
      },
    });
  }
}
