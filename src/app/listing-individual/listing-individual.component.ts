import { Component, OnInit } from "@angular/core";

declare var $: any;

@Component({
  selector: "app-listing-individual",
  templateUrl: "./listing-individual.component.html",
  styleUrls: ["./listing-individual.component.scss"],
})
export class ListingIndividualComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    window.scroll(0, 0);

    $(".navigation-tabs li").on("click", function () {
      $(".navigation-tabs li").removeClass("active");
      $(this).addClass("active");
    });
    this.tabs_selected("story");
  }

  initiateSlick() {
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
