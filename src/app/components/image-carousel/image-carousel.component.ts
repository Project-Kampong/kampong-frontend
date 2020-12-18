import { Component, OnInit, Input } from "@angular/core";

declare var $: any;

@Component({
  selector: "app-image-carousel",
  templateUrl: "./image-carousel.component.html",
  styleUrls: ["./image-carousel.component.scss"],
})
export class ImageCarousel implements OnInit {
  constructor() {}

  sliderSlicked = false;
  navSlicked = false;
  @Input() sliderImages = [];

  ngOnInit() {
    const sliderLength = this.sliderImages.length;
    for (var i = 0; i < sliderLength; i++) {
      if (this.sliderImages[i] == null) {
        this.sliderImages.splice(i, sliderLength - i);
        return;
      }
    }
  }

  sliderSlickInit() {
    if (this.sliderSlicked) {
      return;
    } else {
      this.sliderSlicked = true;
      $(".carousel-slider").slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        dots: true,
        infinite: false,
        adaptiveHeight: false,
        // asNavFor: ".carousel-nav",
      });
    }
  }
  navSlickInit() {
    if (this.navSlicked) {
      return;
    } else if (this.sliderImages.length > 0) {
      if (this.sliderImages.length > 1) {
        this.navSlicked = true;
        $(".carousel-nav").slick({
          slidesToShow: 3,
          slidesToScroll: 1,
          asNavFor: ".carousel-slider",
          dots: false,
          arrows: true,
          infinite: false,
          centerMode: true,
          focusOnSelect: true,
          adaptiveHeight: false,
        });
      } else if (this.sliderImages.length == 1) {
        $(".carousel-nav img").css({
          "max-width": "100px",
        });
      }
    }
  }
}
