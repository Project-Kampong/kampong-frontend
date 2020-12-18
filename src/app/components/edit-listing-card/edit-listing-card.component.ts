import { Component, Input } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "edit-listing-card",
  templateUrl: "./edit-listing-card.component.html",
  styleUrls: ["./edit-listing-card.component.scss"],
})
export class EditListingCard {
  
  constructor(private router: Router) {}

  @Input() listingData;

  selectListing(): void {
    this.router.navigate(["/listing/" + this.listingData.listing_id]);
  }
  
  editListing(): void {
    this.router.navigate(["/edit/" + this.listingData.listing_id]);
  }
}
