import { Component, Input } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-edit-listing-cards",
  templateUrl: "./edit-listing-cards.component.html",
  styleUrls: ["./edit-listing-cards.component.scss"],
})
export class EditListingCardsComponent {
  
  constructor(private router: Router) {}

  @Input() listingData;
  @Input() colNum;

  selectedCard(data) {
    this.router.navigate(["/listing/" + data.listing_id]);
  }
  editListing(data) {
    this.router.navigate(["/edit/" + data.listing_id]);
  }
}
