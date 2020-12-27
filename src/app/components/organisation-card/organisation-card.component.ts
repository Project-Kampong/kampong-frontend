import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Organisation } from '@app/interfaces/organisation';

@Component({
  selector: 'app-organisation-card',
  templateUrl: './organisation-card.component.html',
  styleUrls: ['./organisation-card.component.scss'],
})
export class OrganisationCardComponent {
  constructor(private router: Router) {}

  @Input() organisationData: Organisation;

  routeToOrg(): void {
    this.router.navigate(['/organisation/' + this.organisationData.organisation_id]);
  }
}
