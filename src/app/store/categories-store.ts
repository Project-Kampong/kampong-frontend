import { CategoryFilter } from '@app/interfaces/filters';
import { observable, action } from 'mobx-angular';

class CategoriesStore {
  @observable categories: Array<CategoryFilter> = [];
  @action setCategories(categories) {
    this.categories = categories;
  }
}
export const categoriesStore = new CategoriesStore();
