import { observable, action } from 'mobx-angular';

class UIStore {
  @observable isLoading: boolean = false;

  @action toggleLoading() {
    this.isLoading = !this.isLoading;
  }
}
export const uiStore = new UIStore();
