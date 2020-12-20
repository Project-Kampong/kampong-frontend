import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

import { ListingsService } from "@app/services/listings.service";
import { AuthService } from "@app/services/auth.service";
import { ProfileService } from "@app/services/profile.service";

// Interface
import { Profile } from "@app/interfaces/profile";
import { Listing } from "@app/interfaces/listing";
import { Subscription } from "rxjs";
declare var $: any;

@Component({
  selector: "app-public-profile",
  templateUrl: "./public-profile.component.html",
  styleUrls: ["./public-profile.component.scss"],
})
export class PublicProfileComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private profileService: ProfileService
  ) {}

  profileData: Profile = <Profile>{};
  likedArr: Listing[] = [];
  startedArr: Listing[] = [];
  likeCount: number = 0;
  profileId: string = "";
  subscriptions: Subscription[] = [];

  ngOnInit() {
    this.profileId = this.route.snapshot.params["id"];
    this.subscriptions.push(this.profileService.getUserProfile(this.profileId).subscribe(
      (data) => {
        this.profileData = data["data"];
      },
      (err) => {
        console.log(err);
        this.router.navigate(["/home"]);
      }
    ));
    
    this.subscriptions.push(this.profileService.getPublicLikes(this.profileId).subscribe(
      (data) => {
        this.likedArr = data["data"];
        this.likeCount = data["count"];
      },
      (err) => {
        console.log(err);
      }
    ));
    
    this.subscriptions.push(this.profileService.getPublicOwnedListings(this.profileId).subscribe(
      (data) => {
        data["data"].map((x) => {
          if (x.deleted_on === null) {
            this.startedArr.push(x);
          }
        })
      },
      (err) => {
        console.log(err);
      }
    ));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  scrollToSection(id) {
    console.log($("#" + id).offset().top);
    var scrollAmt = $("#" + id).offset().top - 20;
    $(".profile-nav li").removeClass("active");
    $("#" + id + "-nav").addClass("active");
    $("html, body").animate({ scrollTop: scrollAmt }, 50);
  }
}
