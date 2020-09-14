import { Component, OnInit } from "@angular/core";
import { ListingsService } from "@app/services/listings.service";
import { AuthService } from "@app/services/auth.service";
import { Listing } from "@app/interfaces/listing";
declare var $: any;

@Component({
  selector: "app-listing-home",
  templateUrl: "./listing-home.component.html",
  styleUrls: ["./listing-home.component.scss"],
})
export class ListingHomeComponent implements OnInit {
  constructor(
    public ListingsService: ListingsService,
    public AuthService: AuthService
  ) {}

  ngOnInit() {
    window.scroll(0, 0);

    $(".category-list ul li").on("click", function () {
      $(this).toggleClass("active");
    });
    // Get Public Listing
    this.ListingsService.getListingLoop(1);
  }
}
