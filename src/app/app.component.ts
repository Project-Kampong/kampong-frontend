import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { environment } from './../environments/environment';
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

  constructor(public AuthService: AuthService, private CategoriesService: CategoriesService, private LocationService: LocationsService) {}

  ngOnInit() {
    this.AuthService.tokenExist();

    this.CategoriesService.getAllCategories().subscribe((data) => {
      let categories = data.data;
      let sortedCategories = _(categories)
        .groupBy((category) => category['category_group'])
        .map((value, key) => {
          let updatedValues = _.map(value, 'category_name');
          return {
            name: key,
            group: updatedValues,
          };
        })
        .value();
      this.categoriesStore.setCategories(sortedCategories);
    });

    this.LocationService.getAllLocations().subscribe((data) => {
      console.log(data);

      let locations = data.data;
      let sortedLocations = _(locations)
        .groupBy((location) => location['zone'])
        .map((value, key) => {
          let updatedValues = _.map(value, 'location_name');
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
