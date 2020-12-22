import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { categoriesStore } from '../app/store/categories-store';
import { CategoriesService } from './services/categories.service';
import * as _ from 'lodash';
import { LocationsService } from './services/locations.service';
import { locationsStore } from '../app/store/locations-store';
import { uiStore } from './store/ui-store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  
  title = 'Kampong-frontend';
  categoriesStore = categoriesStore;
  locationsStore = locationsStore;
  uiStore = uiStore;

  constructor(private authService: AuthService, private categoriesService: CategoriesService, private locationService: LocationsService) {}

  ngOnInit() {

    this.authService.checkCookieAndSetHeaders();

    this.categoriesService.getAllCategories().subscribe((data) => {
      let categories = data.data;
      let sortedCategories = _(categories)
        .groupBy((category) => category['category_group'])
        .map((values, key) => {
          let updatedValues = _.map(values, (value) => _.pick(value, 'category_id', 'category_name'));
          return {
            name: key,
            group: updatedValues,
          };
        })
        .value();
      this.categoriesStore.setCategories(sortedCategories);
    });

    this.locationService.getAllLocations().subscribe((data) => {
      let locations = data.data;
      let sortedLocations = _(locations)
        .groupBy((location) => location['zone'])
        .map((values, key) => {
          let updatedValues = _.map(values, (value) => _.pick(value, 'location_id', 'location_name'));
          return {
            name: key,
            group: updatedValues,
          };
        })
        .value();
      this.locationsStore.setLocations(sortedLocations);
    });
  }
}
