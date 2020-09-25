import { Component, OnInit } from "@angular/core";
import { ListingsService } from "@app/services/listings.service";
import { AuthService } from "@app/services/auth.service";
import { Listing } from "@app/interfaces/listing";
declare var $: any;

@Component({
  selector: "app-listing-home",
  templateUrl: "./listing-home.component.html",
  styleUrls: ["./listing-home.component.scss"],
})
export class ListingHomeComponent implements OnInit {
  constructor(
    public ListingsService: ListingsService,
    public AuthService: AuthService
  ) {}
  categoryGroup = [
    {
      name: "Social",
      group: [
        "Health",
        "Marriage",
        "Education",
        "Mentorship",
        "Retirement",
        "Housing",
        "Rental Flats",
        "Family",
        "Gender",
        "Elderly",
        "Youth",
        "Youth At Risk",
        "Pre-School",
        "Race",
        "Language",
        "Science",
        "Art",
        "Sports",
        "Poverty",
        "Inequality",
      ],
    },
    {
      name: "Environment",
      group: ["Recycling", "Green", "Water", "Waste", "Food", "Growing"],
    },
    {
      name: "Economical",
      group: [
        "Finance",
        "Jobs",
        "Wage",
        "Upskill",
        "Technology ",
        "IT",
        "IoT 4.0",
        "Information",
        "Automation",
        "Online",
        "Digitalization",
      ],
    },
    {
      name: "Others",
      group: ["Productivity", "Innovation", "Research", "Manpower", "Design"],
    },
  ];

  ngOnInit() {
    window.scroll(0, 0);

    $(".category-list ul li").on("click", function () {
      $(this).toggleClass("active");
    });
    // Get Public Listing
    this.ListingsService.getListingLoop(1);

    $(".category-filter ul li .outline").on("click", function () {
      $(this).toggleClass("active");
    });
  }
}
