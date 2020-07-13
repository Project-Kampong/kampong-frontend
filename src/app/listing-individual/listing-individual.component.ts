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
    $(".navigation-tabs li").on("click", function () {
      $(".navigation-tabs li").removeClass("active");
      $(this).addClass("active");
    });
    $("#story").show();
  }
  liked_clicked() {
    console.log("liked");
  }

  tabs_selected(selected) {
    console.log(selected);
    $(".tabs-content").hide();
    $("#" + selected).show();
  }
}
