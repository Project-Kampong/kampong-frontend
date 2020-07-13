import { Component, OnInit } from "@angular/core";
declare var $: any;

@Component({
  selector: "app-banner",
  templateUrl: "./banner.component.html",
  styleUrls: ["./banner.component.scss"],
})
export class BannerComponent implements OnInit {
  constructor() {}

  ngOnInit() {
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
  }
}
