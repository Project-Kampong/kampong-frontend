import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-listing-grid',
  templateUrl: './listing-grid.component.html',
  styleUrls: ['./listing-grid.component.scss'],
})
export class ListingGridComponent {
  constructor() {}

  @Input() listings;
  @Input() colNum;
}
