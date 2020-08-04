import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

import { ListingsService } from "../services/listings.service";
import { AuthService } from "../services/auth.service";
import { ProfileService } from "../services/profile.service";

// Interface
import { Profile } from "../interfaces/profile";
import { Listing } from "../interfaces/listing";

@Component({
  selector: "app-public-profile",
  templateUrl: "./public-profile.component.html",
  styleUrls: ["./public-profile.component.scss"],
})
export class PublicProfileComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public ListingsService: ListingsService,
    public AuthService: AuthService,
    public ProfileService: ProfileService
  ) {}

  ProfileDetails: Profile[];
  LikedArr: Listing[] = [];
  LikeCount = 0;
  profileIdSelected;
  ngOnInit() {
    this.profileIdSelected = this.route.snapshot.params["id"];
    this.getInitData();
  }

  getInitData() {
    this.ProfileService.getUserProfile(this.profileIdSelected).subscribe(
      (data) => {
        this.ProfileDetails = data["data"];
        console.log(this.ProfileDetails);
      }
    );

    // Liked
    this.ProfileService.getPublicLikes(this.profileIdSelected).subscribe(
      (data) => {
        const Liked = data["data"];
        this.LikeCount = data["count"];
        for (var i = 0; i < Liked.length; i++) {
          this.ListingsService.getSelectedListing(
            Liked[i].listing_id
          ).subscribe((listing) => {
            this.LikedArr.push(listing["data"]);
          });
        }
      }
    );
    // Started
  }
}
