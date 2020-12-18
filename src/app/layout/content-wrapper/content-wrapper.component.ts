import { Component, OnDestroy, OnInit } from "@angular/core";
declare var $: any;
import { AuthService } from "@app/services/auth.service";
import { ProfileService } from "@app/services/profile.service";
import { Profile } from "@app/interfaces/profile";
import { UserData } from "@app/interfaces/user";
import { Subscription } from "rxjs";

@Component({
  selector: "app-content-wrapper",
  templateUrl: "./content-wrapper.component.html",
  styleUrls: ["./content-wrapper.component.scss"],
})
export class ContentWrapper implements OnInit, OnDestroy {

  constructor(private authService: AuthService, private profileService: ProfileService) {}

  private userData: UserData = <UserData>{};
  profileData: Profile = <Profile>{};
  dropDownInitiated: boolean = false;
  isLoggedIn: boolean;
  subscriptions: Subscription[] = [];

  ngOnInit() {
    this.userData = this.authService.getUserDetails();
    this.isLoggedIn = this.authService.getIsLoggedIn();
    this.subscriptions.push(this.profileService.getUserProfile(this.userData["user_id"]).subscribe(
      (res) => {
        this.profileData = res["data"];
      },
      (err) => {
        console.log(err);
      }
    ));

    if (this.dropDownInitiated) {
      return;
    } else {
      $(".user-info").on("click", function() {
        $(".dropdown-icon").toggleClass("active");
        $(".profile-dropdown").toggleClass("active");
      });
      $(".profile-dropdown li").on("click", function() {
        $(".dropdown-icon").toggleClass("active");
        $(".profile-dropdown").toggleClass("active");
      });
      this.dropDownInitiated = true;
    }

    $(".menu-btn, .close-menu-btn, .close-menu-overlay").on("click", function() {
      if ($(".user-info-container").hasClass("menu-open")) {
        $(".user-info-container").css({ right: "-100%" }).removeClass("menu-open");
        $(".close-menu-overlay").removeClass("menu-open");
      } else {
        $(".user-info-container").css({ right: 0 }).addClass("menu-open");
        $(".close-menu-overlay").addClass("menu-open");
      }
    });
  }

  logoutUser():void {
      this.authService.logoutUser();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}