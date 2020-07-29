import { Component, OnInit, Input } from "@angular/core";

declare var $: any;

@Component({
  selector: "app-image-carousel",
  templateUrl: "./image-carousel.component.html",
  styleUrls: ["./image-carousel.component.scss"],
})
export class ImageCarouselComponent implements OnInit {
  constructor() {}

  sliderSlicked = false;
  navSlicked = false;
  @Input() SliderImages = [];

  ngOnInit() {
    for (var i = 0; i < this.SliderImages.length; i++) {
      if (this.SliderImages[i] == null) {
        this.SliderImages.splice(i, 1);
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
        arrows: false,
        fade: true,
        infinite: false,
        adaptiveHeight: false,
        asNavFor: ".carousel-nav",
      });
    }
  }
  navSlickInit() {
    if (this.navSlicked) {
      return;
    } else {
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
    }
  }
}
