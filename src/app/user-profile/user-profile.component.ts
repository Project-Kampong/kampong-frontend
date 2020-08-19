import { Component, OnInit } from "@angular/core";

import { ListingsService } from "../services/listings.service";
import { AuthService } from "../services/auth.service";
import { ProfileService } from "../services/profile.service";

// Interface
import { Profile } from "../interfaces/profile";
import { Listing } from "../interfaces/listing";

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
      for (var i = 0; i < Liked.length; i++) {
        this.ListingsService.getSelectedListing(Liked[i].listing_id).subscribe(
          (listing) => {
            if (listing["data"].deleted_on == null) {
              this.LikedArr.push(listing["data"]);
            }
          }
        );
      }
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
}
