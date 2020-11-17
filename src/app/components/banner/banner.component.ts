import { Component, OnInit, Input } from "@angular/core";
declare var $: any;
import { ListingsService } from "@app/services/listings.service";

@Component({
  selector: "app-banner",
  templateUrl: "./banner.component.html",
  styleUrls: ["./banner.component.scss"],
})
export class BannerComponent implements OnInit {

  featuredData = [];
  slickInitiated = false;
  numtoget: number;

  constructor(public ListingsService: ListingsService) {
    this.numtoget = 0;
  }

  ngOnInit() {
    this.ListingsService.getFeaturedListings().subscribe((data) => {
      this.featuredData = data.data;
      this.numtoget = this.featuredData.length;
    });
  }

  sliderSlickInit(): void {
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
