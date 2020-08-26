import { Component, OnInit } from "@angular/core";

declare var $: any;

import { AuthService } from "../../services/auth.service";
import { ProfileService } from "../../services/profile.service";

// Interface
import { Profile } from "../../interfaces/profile";
@Component({
  selector: "app-content-wrapper",
  templateUrl: "./content-wrapper.component.html",
  styleUrls: ["./content-wrapper.component.scss"],
})
export class ContentWrapperComponent implements OnInit {
  constructor(
    public AuthService: AuthService,
    public ProfileService: ProfileService
  ) {}

  ProfileDetails: Profile;
  dropDownInitiated = false;

  ngOnInit() {
    if (this.AuthService.isLoggedIn) {
      this.getInitData();
    }
    this.AuthService.LoginResponse.subscribe(() => {
      this.getInitData();
    });

    $(".menu-btn, .close-menu-btn, .close-menu-overlay").on(
      "click",
      function () {
        console.log("menu clicked");
        if ($(".user-info-container").hasClass("menu-open")) {
          $(".user-info-container")
            .css({
              right: "-100%",
            })
            .removeClass("menu-open");
          $(".close-menu-overlay").removeClass("menu-open");
        } else {
          $(".user-info-container")
            .css({
              right: 0,
            })
            .addClass("menu-open");
          $(".close-menu-overlay").addClass("menu-open");
        }
      }
    );
  }

  getInitData() {
    this.ProfileService.getUserProfile(
      this.AuthService.LoggedInUserID
    ).subscribe((data) => {
      this.ProfileDetails = data["data"];
      if (this.ProfileDetails["profile_picture"] == null) {
        this.ProfileDetails["profile_picture"] =
          "https://www.nicepng.com/png/full/128-1280406_view-user-icon-png-user-circle-icon-png.png";
      }

      if (this.dropDownInitiated) {
        return;
      } else {
        $(".user-info").on("click", function () {
          $(".dropdown-icon").toggleClass("active");
          $(".profile-dropdown").toggleClass("active");
        });
        this.dropDownInitiated = true;
      }
    });
  }

  logout() {
    this.AuthService.logout();
  }
}
