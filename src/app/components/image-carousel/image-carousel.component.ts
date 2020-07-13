import { Component, OnInit } from "@angular/core";

declare var $: any;

@Component({
  selector: "app-image-carousel",
  templateUrl: "./image-carousel.component.html",
  styleUrls: ["./image-carousel.component.scss"],
})
export class ImageCarouselComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    $(".carousel-slider").slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      fade: true,
      infinite: false,
      adaptiveHeight: false,
      asNavFor: ".carousel-nav",
    });
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
  }
}
