import { observable, action } from 'mobx-angular';
import { LocationFilter } from '@app/interfaces/filters';

class LocationsStore {
  @observable locations: Array<LocationFilter> = [];
  @action setLocations(locations) {
    this.locations = locations;
  }
}
export const locationsStore = new LocationsStore();
