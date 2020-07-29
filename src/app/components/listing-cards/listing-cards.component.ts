import { Component, OnInit, Input } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-listing-cards",
  templateUrl: "./listing-cards.component.html",
  styleUrls: ["./listing-cards.component.scss"],
})
export class ListingCardsComponent implements OnInit {
  constructor(private router: Router) {}

  @Input() ListingData;

  ngOnInit() {
    console.log(this.ListingData);
  }
  selectedCard(data) {
    console.log(data);
    this.router.navigate(["/listing/" + data.listing_id]);
  }
}
