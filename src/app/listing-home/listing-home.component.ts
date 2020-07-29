import { Component, OnInit } from "@angular/core";
import { ListingsService } from "../services/listings.service";
@Component({
  selector: "app-listing-home",
  templateUrl: "./listing-home.component.html",
  styleUrls: ["./listing-home.component.scss"],
})
export class ListingHomeComponent implements OnInit {
  constructor(public ListingsService: ListingsService) {}

  ngOnInit() {
    window.scroll(0, 0);

    this.ListingsService.getListings();
  }
}
