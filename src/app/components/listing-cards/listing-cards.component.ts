import { Component, Input } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-listing-cards",
  templateUrl: "./listing-cards.component.html",
  styleUrls: ["./listing-cards.component.scss"],
})
export class ListingCardsComponent {
  
  constructor(private router: Router) {}

  @Input() listingData;
  @Input() colNum;

  selectedCard(data) {
    this.router.navigate(["/listing/" + data.listing_id]);
  }
}
