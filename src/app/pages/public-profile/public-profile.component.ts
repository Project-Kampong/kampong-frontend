import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

import { ListingsService } from "@app/services/listings.service";
import { AuthService } from "@app/services/auth.service";
import { ProfileService } from "@app/services/profile.service";

// Interface
import { Profile } from "@app/interfaces/profile";
import { Listing } from "@app/interfaces/listing";

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

  ProfileDetails: Profile = <Profile>{};
  LikedArr: Listing[] = [];
  StartedArr: Listing[] = [];
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
        if (this.ProfileDetails.profile_picture == null) {
          this.ProfileDetails.profile_picture =
            "https://www.nicepng.com/png/full/128-1280406_view-user-icon-png-user-circle-icon-png.png";
        }
      },
      (err) => {
        this.router.navigate(["/home"]);
        return;
      },
      () => {
        // Liked
        this.ProfileService.getPublicLikes(this.profileIdSelected).subscribe(
          (data) => {
            const Liked = data["data"];
            this.LikeCount = data["count"];
            this.LikedArr = Liked;
          }
        );
        // Started
        this.ListingsService.getPublicOwnedListings(
          this.profileIdSelected
        ).subscribe((data) => {
          console.log(data);
          data["data"].map((x) => {
            if (x.deleted_on == null) {
              this.StartedArr.push(x);
            }
          });
        });
      }
    );
  }
}
