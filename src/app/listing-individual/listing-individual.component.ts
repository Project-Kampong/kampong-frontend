import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

import { ListingsService } from "../services/listings.service";

// Interface
import { Listing, DefaultListing } from "../interfaces/listing";

declare var $: any;

@Component({
  selector: "app-listing-individual",
  templateUrl: "./listing-individual.component.html",
  styleUrls: ["./listing-individual.component.scss"],
})
export class ListingIndividualComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private ListingsService: ListingsService
  ) {}

  listingId;
  ListingData: Listing[];
  SliderImageArr = [];

  ngOnInit() {
    this.listingId = this.route.snapshot.params["id"];
    console.log(this.listingId);
    window.scroll(0, 0);

    this.ListingsService.getSelectedListing(this.listingId).subscribe(
      (data) => {
        this.ListingData = data["data"];
        console.log(this.ListingData);

        this.SliderImageArr.push(
          this.ListingData["pic1"],
          this.ListingData["pic2"],
          this.ListingData["pic3"],
          this.ListingData["pic4"],
          this.ListingData["pic5"]
        );
        this.ListingsService.getUserProfile(
          this.ListingData["created_by"]
        ).subscribe((profile) => {
          console.log(profile);
        });
      }
    );
    // UI Components
    $(".navigation-tabs li").on("click", function () {
      $(".navigation-tabs li").removeClass("active");
      $(this).addClass("active");
    });
    this.tabs_selected("story");
  }

  UpdateSlicked = false;
  // UI Components
  initiateSlick() {
    if (this.UpdateSlicked) {
      return;
    } else {
      this.UpdateSlicked = true;
      $(".update-image-slider").slick({
        slidesToShow: 2,
        slidesToScroll: 1,
        dots: true,
        arrows: true,
        infinite: false,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 1,
            },
          },
        ],
      });
    }
  }

  liked_clicked() {
    // console.log("liked");
  }

  tabs_selected(selected) {
    $(".tabs-content").hide();
    $("#" + selected).show();
    if (selected == "updates") {
      this.initiateSlick();
    }
  }
}
