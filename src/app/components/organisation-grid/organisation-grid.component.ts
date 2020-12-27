import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-organisation-grid',
  templateUrl: './organisation-grid.component.html',
  styleUrls: ['./organisation-grid.component.scss'],
})
export class OrganisationGridComponent {
  constructor() {}

  @Input() organisations;
  @Input() colNum;
}
