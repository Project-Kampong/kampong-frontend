// Angular Imports
import { Component, OnInit } from "@angular/core";

// Services
import { ListingsService } from "@app/services/listings.service";
import { AuthService } from "@app/services/auth.service";
import { ProfileService } from "@app/services/profile.service";
import { OrganisationsService } from '@app/services/organisations.service';

// Interfaces
import { Profile } from "@app/interfaces/profile";
import { Listing } from "@app/interfaces/listing";
import { Organisation } from "@app/interfaces/organisation";

declare var $: any;

@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.scss"],
})
export class UserProfileComponent implements OnInit {

  profileDetails: Profile;
  likedArr: Listing[];
  startedArr: Listing[];
  likeCount: number;
  orgArr: Organisation[];

  constructor(
    public listingsService: ListingsService,
    public authService: AuthService,
    public profileService: ProfileService,
    public organisationService: OrganisationsService,
  ) {
    this.likedArr = [];
    this.startedArr = [];
    this.orgArr = [];
    this.likeCount = 0;
  }

  ngOnInit() {
    if (this.authService.isLoggedIn) {
      this.getInitData();
    }

    this.authService.LoginResponse.subscribe(() => {
      this.getInitData();
    });
  }

  getInitData() {
    this.profileService.getUserProfile(
      this.authService.LoggedInUserID
    ).subscribe((data) => {
      this.profileDetails = data["data"];
      if (this.profileDetails.profile_picture == null) {
        this.profileDetails.profile_picture =
          "https://www.nicepng.com/png/full/128-1280406_view-user-icon-png-user-circle-icon-png.png";
      }
    });

    // Liked
    this.listingsService.getLikedListing().subscribe((data) => {
      this.likeCount = data["count"];
      this.likedArr = data["data"];
    });
    // Started
    this.listingsService.getPublicOwnedListings(
      this.authService.LoggedInUserID
    ).subscribe((data) => {
      data["data"].map((x) => {
        if (x.deleted_on == null) {
          this.startedArr.push(x);
        }
      });
    });

    this.organisationService.getOrganisations(1).subscribe(
      (res) => {
        console.log(res);
        this.orgArr = res["data"].filter((org) => (
          org["owned_by"] === this.authService.LoggedInUserID
        ))
      }
    );
  }

  scrollToSection(id) {
    console.log($("#" + id).offset().top);
    var scrollAmt = $("#" + id).offset().top - 20;
    $(".profile-nav li").removeClass("active");
    $("#" + id + "-nav").addClass("active");
    $("html, body").animate({ scrollTop: scrollAmt }, 50);
  }
}
