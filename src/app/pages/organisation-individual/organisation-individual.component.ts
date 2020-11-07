import { Component, OnInit, Inject } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

import { OrganisationsService } from "@app/services/organisations.service";
import { ProfileService } from "@app/services/profile.service";
import { AuthService } from "@app/services/auth.service";
import { SnackbarService } from "@app/services/snackbar.service";

// Interface
import {
  Organisation,
} from "@app/interfaces/organisation";
import { Profile } from "@app/interfaces/profile";

declare var $: any;

@Component({
  selector: "app-organisation-individual",
  templateUrl: "./organisation-individual.component.html",
  styleUrls: ["./organisation-individual.component.scss"],
})
export class OrganisationIndividualComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private OrganisationsService: OrganisationsService,
    private ProfileService: ProfileService,
    public AuthService: AuthService,
    public SnackbarService: SnackbarService
  ) {}

  organisationId;
  hashID;

  // Data Arr
  OrganisationData: Organisation = <Organisation>{};
  ProfileInfo: Profile = <Profile>{};
  Hashtags = [];
  // Stories

  // UI
  SliderImageArr = [];
  currentDate = new Date();

  // Updates
  ngOnInit() {
    window.scroll(0, 0);
    this.organisationId = this.route.snapshot.params["id"];
    this.getInitData();

    // UI Components
    $(".navigation-tabs li").on("click", function () {
      $(".navigation-tabs li").removeClass("active");
      $(this).addClass("active");
    });
    this.tabs_selected("story");
  }

  getInitData() {
    // Static

    // Get Listing Info
    this.OrganisationsService.getSelectedOrganisation(this.organisationId).subscribe(
      (data) => {
        this.OrganisationData = data["data"];
        console.log(this.OrganisationData);
        console.log(this.OrganisationData);
        this.ProfileService.getUserProfile(
          this.OrganisationData["owned_by"]
        ).subscribe((profile) => {
          this.ProfileInfo = profile["data"];
          if (this.ProfileInfo.profile_picture == null) {
            this.ProfileInfo.profile_picture =
              "https://www.nicepng.com/png/full/128-1280406_view-user-icon-png-user-circle-icon-png.png";
          }
        });
      },
      (err) => {
        this.router.navigate(["/home"]);
      },
      () => {
        // Public Data
        // Get Num of Likes
        // Get FAQ Info

        // Get Skills
        // this.ListingsService.getSelectedListingSkills(this.listingId).subscribe(
        //   (data) => {
        //     this.SkillsList = data["data"];
        //     console.log(this.SkillsList);
        //   }
        // );
        // Get Hashtags

        // Get Location

        // Get Stories

        // Get Comments

        // Get Updates

        // Get Milestones

        // End of Data Retrive
      }
    );
  }

  // File Upload

  // Updates
  getDiffInTime(time) {
    const newTime = new Date(time);
    var diff = this.currentDate.getTime() - newTime.getTime();
    diff /= 1000;

    var hh = Math.floor(diff / (60 * 60));
    var dd = Math.floor(diff / (60 * 60 * 24));
    var mm = Math.floor(diff / (60 * 60 * 24 * 30));
    var yy = Math.floor(diff / (60 * 60 * 24 * 30 * 12));
    if (hh > 24) {
      // retun day
      if (dd > 30) {
        if (mm > 12) {
          if (yy > 1) {
            return yy + " Years ago";
          } else {
            return yy + " Year ago";
          }
        } else {
          if (mm > 1) {
            return mm + " Months ago";
          } else {
            return mm + " Month ago";
          }
        }
      } else {
        if (dd > 1) {
          return dd + " Days ago";
        } else {
          return dd + " Day ago";
        }
      }
    } else if (hh < 1) {
      return "Less than 1 Hour ago";
    } else {
      if (hh > 1) {
        return hh + " Hours ago";
      } else {
        return hh + " Hour ago";
      }
    }
  }

  // UI Components

  UpdateSlicked = false;
  initiateSlick() {
    if (!$(".update-image-slider").hasClass("slick-initialized")) {
      $(".update-image-slider").slick({
        slidesToShow: 2,
        slidesToScroll: 1,
        dots: true,
        arrows: true,
        infinite: false,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 1,
            },
          },
        ],
      });
    } else {
      $(".update-image-slider").slick("unslick");
      this.initiateSlick();
    }
  }

  tabs_selected(selected) {
    $(".tabs-content").hide();
    $("#" + selected).show();
    if (selected == "updates") {
      this.initiateSlick();
    }
  }

  selectedProfile(user_id) {
    this.router.navigate(["/profile/" + user_id]);
  }

  enquireMessage: String = "";
  // Toggle Enquire popup
  togglePopup() {
    // Toggle popup
    $(".popup-bg").toggleClass("active");
    $(".popup-box").toggleClass("active");
  }
  sendMessage() {
    if (this.enquireMessage != "") {
      this.togglePopup();
      this.SnackbarService.openSnackBar(
        this.SnackbarService.DialogList.send_message.success,
        true
      );
    }
  }
}
