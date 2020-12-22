// Angular Imports
import { Component, OnDestroy, OnInit } from "@angular/core";

// Services
import { ListingsService } from "@app/services/listings.service";
import { AuthService } from "@app/services/auth.service";
import { ProfileService } from "@app/services/profile.service";
import { OrganisationsService } from '@app/services/organisations.service';

// Interfaces
import { Profile } from "@app/interfaces/profile";
import { Listing } from "@app/interfaces/listing";
import { Organisation } from "@app/interfaces/organisation";
import { UserData } from "@app/interfaces/user";
import { Subscription } from "rxjs";
import { UsersService } from "@app/services/users.service";

declare var $: any;

@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.scss"],
})
export class UserProfileComponent implements OnInit, OnDestroy {

  profileData: Profile = <Profile>{};
  likedArr: Listing[] = [];
  startedArr: Listing[] = [];
  likeCount: number = 0;
  orgArr: Organisation[] = [];
  private userData: UserData = <UserData>{};
  isLoggedIn: boolean = false;
  subscriptions: Subscription[] = [];

  constructor(private authService: AuthService, private profileService: ProfileService, private userService: UsersService) {}

  ngOnInit() {

    if (this.authService.checkCookie()) {
      this.subscriptions.push(this.authService.getUserDataByToken().subscribe(
        (res) => {
          this.userData = res["data"];
          this.subscriptions.push(this.profileService.getUserProfile(this.userData["user_id"]).subscribe(
            (res) => {
              this.profileData = res["data"];
              this.isLoggedIn = true;
            },
            (err) => {
              console.log(err);
            }
          ))
        },
        (err) => {
          console.log(err);
          console.log("User is not logged in");
        },
        () => {
          this.subscriptions.push(this.userService.getLikedListing(this.userData["user_id"]).subscribe(
            (res) => {
              this.likeCount = res["count"];
              this.likedArr = res["data"];
            },
            (err) => {
              console.log(err);
            }
          ));
          this.subscriptions.push(this.userService.getOwnedListings(this.userData["user_id"]).subscribe(
            (res) => {
              res["data"].map((x) => {
                if (x.deleted_on === null) {
                  this.startedArr.push(x);
                }
              })
            }
          ));
        }
      ))
    }


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
