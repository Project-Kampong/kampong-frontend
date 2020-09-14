import { Component, OnInit, Input } from "@angular/core";
declare var $: any;
import { ListingsService } from "@app/services/listings.service";

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
      const position = this.ListingsService.FeaturedListingData.length - i - 1;
      console.log(position);
      this.featuredData.push(
        this.ListingsService.FeaturedListingData[position]
      );
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
        infinite: true,
        autoplay: true,
        autoplaySpeed: 2000,
        draggable: false,
        speed: 300,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              arrows: false,
              draggable: true,
            },
          },
        ],
      });
      this.slickInitiated = true;
    }
  }
}
