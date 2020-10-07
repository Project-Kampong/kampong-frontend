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
  numtoget = 0;
  ngOnInit() {
    this.ListingsService.getFeaturedListings().subscribe((data) => {
      console.log(data);
      const tempFeatured = data["data"];
      this.numtoget = data["count"];
      tempFeatured.map((x) => {
        this.ListingsService.getSelectedListing(x.listing_id).subscribe(
          (item) => {
            console.log(item["data"]);
            this.featuredData.push(item["data"]);
          }
        );
      });
    });
  }

  sliderSlickInit() {
    if (this.slickInitiated) {
      return;
    } else if (this.featuredData.length == this.numtoget) {
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
              autoplay: false,
            },
          },
        ],
      });
      this.slickInitiated = true;
    }
  }
}
