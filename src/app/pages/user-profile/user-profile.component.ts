import { Component, OnInit } from "@angular/core";

import { ListingsService } from "@app/services/listings.service";
import { AuthService } from "@app/services/auth.service";
import { ProfileService } from "@app/services/profile.service";

// Interface
import { Profile } from "@app/interfaces/profile";
import { Listing } from "@app/interfaces/listing";
declare var $: any;

@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.scss"],
})
export class UserProfileComponent implements OnInit {
  constructor(
    public ListingsService: ListingsService,
    public AuthService: AuthService,
    public ProfileService: ProfileService
  ) {}

  ProfileDetails: Profile = <Profile>{};
  LikedArr: Listing[] = [];
  StartedArr: Listing[] = [];
  LikeCount = 0;

  ngOnInit() {
    if (this.AuthService.isLoggedIn) {
      this.getInitData();
    }

    this.AuthService.LoginResponse.subscribe(() => {
      this.getInitData();
    });
  }

  getInitData() {
    this.ProfileService.getUserProfile(
      this.AuthService.LoggedInUserID
    ).subscribe((data) => {
      this.ProfileDetails = data["data"];
      if (this.ProfileDetails.profile_picture == null) {
        this.ProfileDetails.profile_picture =
          "https://www.nicepng.com/png/full/128-1280406_view-user-icon-png-user-circle-icon-png.png";
      }
    });

    // Liked
    this.ListingsService.getLikedListing().subscribe((data) => {
      const Liked = data["data"];
      this.LikeCount = data["count"];
      this.LikedArr = Liked;
    });
    // Started
    this.ListingsService.getPublicOwnedListings(
      this.AuthService.LoggedInUserID
    ).subscribe((data) => {
      console.log(data);
      data["data"].map((x) => {
        if (x.deleted_on == null) {
          this.StartedArr.push(x);
        }
      });
    });
  }

  scrollToSection(id) {
    console.log($("#" + id).offset().top);
    var scrollAmt = $("#" + id).offset().top - 20;
    $(".profile-nav li").removeClass("active");
    $("#" + id + "-nav").addClass("active");
    $("html, body").animate({ scrollTop: scrollAmt }, 50);
  }
}
