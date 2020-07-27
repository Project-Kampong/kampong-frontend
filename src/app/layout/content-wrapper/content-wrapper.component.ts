import { Component, OnInit } from "@angular/core";

declare var $: any;

@Component({
  selector: "app-content-wrapper",
  templateUrl: "./content-wrapper.component.html",
  styleUrls: ["./content-wrapper.component.scss"],
})
export class ContentWrapperComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    $(".user-info").on("click", function () {
      $(".profile-dropdown").toggleClass("active");
    });
    $(".user-info .profile-dropdown li").on("click", function () {
      $(".profile-dropdown").hide();
    });
  }
}
