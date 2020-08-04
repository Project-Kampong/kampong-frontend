import { Component, OnInit, Input } from "@angular/core";
declare var $: any;
import { ListingsService } from "../../services/listings.service";

@Component({
  selector: "app-banner",
  templateUrl: "./banner.component.html",
  styleUrls: ["./banner.component.scss"],
})
export class BannerComponent implements OnInit {
  constructor(public ListingsService: ListingsService) {}
  featuredData = [];
  slickInitiated = false;
  ngOnInit() {
    // Extract 3 From ListingData
    // To be replaced with featuredListings API
    for (var i = 0; i < 3; i++) {
      this.featuredData.push(this.ListingsService.FeaturedListingData[i]);
    }
  }

  sliderSlickInit() {
    if (this.slickInitiated) {
      return;
    } else {
      // Jquery
      $(".slick-belt").slick({
        slidesToShow: 1,
        adaptiveHeight: true,
        arrows: true,
        dots: true,
        infinite: false,
        speed: 300,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              arrows: false,
            },
          },
        ],
      });
      this.slickInitiated = true;
    }
  }
}
