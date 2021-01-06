import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ListingIndividual } from '@app/interfaces/listing';

@Component({
  selector: 'app-listing-card',
  templateUrl: './listing-card.component.html',
  styleUrls: ['./listing-card.component.scss'],
})
export class ListingCardComponent {
  constructor(private router: Router) {}

  @Input() listingData: ListingIndividual;

  routeToListing(): void {
    this.router.navigate(['/listing/' + this.listingData.listing_id]);
  }
}
