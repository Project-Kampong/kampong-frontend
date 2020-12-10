import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { environment } from './../environments/environment';
import { categoriesStore } from '../app/store/categories-store';
import { CategoriesService } from './services/categories.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Kampong-frontend';
  categoriesStore = categoriesStore;

  constructor(public AuthService: AuthService, private CategoriesService: CategoriesService) {}

  ngOnInit() {
    this.AuthService.tokenExist();

    this.CategoriesService.getAllCategories().subscribe((data) => {
      let categories = data.data;
      let sortedCategories = _(categories)
        .groupBy((category) => category['category_group'])
        // .map((value, key) => ({ name: key, group: value }))
        .map((value, key) => {
          let updatedValues = _.map(value, 'category_name');
          return {
            name: key,
            group: updatedValues,
          };
        })
        .value();
      console.log(sortedCategories);
      this.categoriesStore.setCategories(sortedCategories);
    });
  }
}
