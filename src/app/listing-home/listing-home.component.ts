import { Component, OnInit } from "@angular/core";
import { ListingsService } from "../services/listings.service";
import { AuthService } from "../services/auth.service";
import { Listing } from "../interfaces/listing";
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

  LikedArr: Listing[] = [];
  ngOnInit() {
    window.scroll(0, 0);

    $(".category-list ul li").on("click", function () {
      $(this).toggleClass("active");
    });
    // Get Public Listing
    this.ListingsService.getListingLoop(1);
    // Get Liked Listing
    if (this.AuthService.isLoggedIn) {
      this.getInitData();
    }
    this.AuthService.LoginResponse.subscribe(() => {
      this.getInitData();
    });
  }

  getInitData() {
    this.ListingsService.getLikedListing().subscribe((data) => {
      const Liked = data["data"];
      for (var i = 0; i < Liked.length; i++) {
        this.ListingsService.getSelectedListing(Liked[i].listing_id).subscribe(
          (listing) => {
            if (listing["data"].deleted_on == null) {
              this.LikedArr.push(listing["data"]);
            }
          }
        );
      }
    });
  }
}
