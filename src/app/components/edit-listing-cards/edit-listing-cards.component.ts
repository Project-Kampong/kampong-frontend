import { Component, OnInit, Input } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-edit-listing-cards",
  templateUrl: "./edit-listing-cards.component.html",
  styleUrls: ["./edit-listing-cards.component.scss"],
})
export class EditListingCardsComponent implements OnInit {
  constructor(private router: Router) {}

  @Input() listingData;
  @Input() colNum;
  ngOnInit() {
    console.log(this.listingData);
  }
  selectedCard(data) {
    console.log(data);
    this.router.navigate(["/listing/" + data.listing_id]);
  }
  editListing(data) {
    console.log(data);
    this.router.navigate(["/edit/" + data.listing_id]);
  }
}
