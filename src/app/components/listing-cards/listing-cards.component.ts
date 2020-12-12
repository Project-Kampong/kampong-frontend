import { Component, Input } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-listing-cards",
  templateUrl: "./listing-cards.component.html",
  styleUrls: ["./listing-cards.component.scss"]
})
export class ListingCardsComponent {
  page : Number;
  constructor(private router: Router) {
    this.page = 1;
  }

  @Input() ListingData;
  @Input() ColNum;

  selectedCard(data) {
    console.log(data);
    this.router.navigate(["/listing/" + data.listing_id]);
  }

  handlePageChange(event) {
    this.page = event;
  }
}
