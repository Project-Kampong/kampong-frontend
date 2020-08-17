import { Component, OnInit, Input } from "@angular/core";

declare var $: any;
@Component({
  selector: "app-update-carousel",
  templateUrl: "./update-carousel.component.html",
  styleUrls: ["./update-carousel.component.scss"],
})
export class UpdateCarouselComponent implements OnInit {
  constructor() {}

  @Input() SliderImages = [];
  ngOnInit() {
    this.SliderImages = this.SliderImages.filter(function (el) {
      return el != null;
    });
    console.log(this.SliderImages);
  }
}
