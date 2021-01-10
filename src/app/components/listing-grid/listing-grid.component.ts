import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-listing-grid',
  templateUrl: './listing-grid.component.html',
  styleUrls: ['./listing-grid.component.scss'],
})
export class ListingGridComponent {
  page: Number;
  constructor() {
    this.page = 1;
  }

  @Input() listings;
  @Input() colNum;

  handlePageChange(event) {
    this.page = event;
  }
}
