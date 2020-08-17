import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

import { ListingsService } from "../services/listings.service";
import { ProfileService } from "../services/profile.service";
import { AuthService } from "../services/auth.service";
// Interface
import {
  Listing,
  DefaultListing,
  ListingFAQ,
  ListingSkills,
  ListingStories,
  ListingComments,
} from "../interfaces/listing";
import { Profile } from "../interfaces/profile";

declare var $: any;

@Component({
  selector: "app-listing-individual",
  templateUrl: "./listing-individual.component.html",
  styleUrls: ["./listing-individual.component.scss"],
})
export class ListingIndividualComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private ListingsService: ListingsService,
    private ProfileService: ProfileService,
    private AuthService: AuthService
  ) {}

  listingId;
  hashID;

  // Data Arr
  ListingData: Listing = <Listing>{};
  ProfileInfo: Profile[];
  Hashtags = [];
  // Stories
  Stories: ListingStories = <ListingStories>{};
  SkillsList: ListingSkills[] = [];
  MilestoneArr = [];
  // Faq
  FAQList: ListingFAQ[];
  // Comments
  CommentsArr = [];
  // Updates
  UpdatesArr = [];

  // UI
  SliderImageArr = [];
  listingLikes;
  userLikedID = "";
  currentDate = new Date();

  // Updates
  fileDisplayArr = [];
  fileArr = [];
  fileLimit = false;
  fileCount = 0;

  ngOnInit() {
    console.log(this.ListingData);
    window.scroll(0, 0);
    this.listingId = this.route.snapshot.params["id"];
    this.getInitData();

    // UI Components
    $(".navigation-tabs li").on("click", function () {
      $(".navigation-tabs li").removeClass("active");
      $(this).addClass("active");
    });
    this.tabs_selected("story");
  }

  getInitData() {
    // Get Listing Info
    this.ListingsService.getSelectedListing(this.listingId).subscribe(
      (data) => {
        this.ListingData = data["data"];
        console.log(this.ListingData);
        this.SliderImageArr.push(
          this.ListingData["pic1"],
          this.ListingData["pic2"],
          this.ListingData["pic3"],
          this.ListingData["pic4"],
          this.ListingData["pic5"]
        );
        console.log(this.SliderImageArr);
        this.ProfileService.getUserProfile(
          this.ListingData["created_by"]
        ).subscribe((profile) => {
          this.ProfileInfo = profile["data"];
          console.log(this.ProfileInfo);
        });

        // Check User Liked List
        this.ListingsService.getLikedListing().subscribe((data) => {
          console.log(data["data"]);
          const likedArr = data["data"];
          for (var i = 0; i < likedArr.length; i++) {
            if (likedArr[i].listing_id == this.listingId) {
              this.userLikedID = likedArr[i].like_id;
              $(".like-btn").addClass("liked");
            }
          }
        });
      }
    );

    // Public Data
    // Get Num of Likes
    this.ListingsService.getSelectedListingLikes(this.listingId).subscribe(
      (data) => {
        this.listingLikes = data["count"];
      }
    );
    // Get FAQ Info
    this.ListingsService.getSelectedListingFAQ(this.listingId).subscribe(
      (data) => {
        this.FAQList = data["data"];
      }
    );

    // Get Skills
    this.ListingsService.getSelectedListingSkills(this.listingId).subscribe(
      (data) => {
        this.SkillsList = data["data"];
        console.log(this.SkillsList);
      }
    );

    // Get Hashtags
    this.ListingsService.getSelectedListingHashtags(this.listingId).subscribe(
      (data) => {
        this.Hashtags = data["data"];
      }
    );

    // Get Stories
    this.ListingsService.getSelectedListingStories(this.listingId).subscribe(
      (data) => {
        this.Stories = data["data"];
        console.log(this.Stories);
      }
    );

    // Get Comments
    this.ListingsService.getSelectedListingComments(this.listingId).subscribe(
      (data) => {
        this.CommentsArr = data["data"];
        this.CommentsArr.sort((a, b) => {
          return <any>new Date(b.updated_on) - <any>new Date(a.updated_on);
        });
      }
    );

    // Get Updates
    this.ListingsService.getSelectedListingUpdates(this.listingId).subscribe(
      (data) => {
        this.UpdatesArr = data["data"];
        this.UpdatesArr.sort((a, b) => {
          return <any>new Date(b.updated_on) - <any>new Date(a.updated_on);
        });
        // this.initiateSlick();
      }
    );

    // Get Milestones
    this.ListingsService.getSelectedListingMilestones(this.listingId).subscribe(
      (data) => {
        this.MilestoneArr = data["data"];
        this.MilestoneArr.sort((a, b) => {
          return <any>new Date(a.date) - <any>new Date(b.date);
        });
      }
    );

    // End of Data Retrive
  }

  // File Upload
  selectedFile: File = null;
  updatesDescription;
  uploadFile(event) {
    this.selectedFile = <File>event.target.files[0];
    console.log(this.selectedFile.size);
    if (this.selectedFile.size > 500000) {
      console.log(this.selectedFile);
    } else {
      // Display Image
      var reader: FileReader = new FileReader();
      reader.onload = (e) => {
        this.fileDisplayArr.push(reader.result.toString());
      };
      reader.readAsDataURL(event.target.files[0]);
      this.fileLimitChecker(true);
      this.fileArr.push(this.selectedFile);
      console.log(this.fileArr);
    }
  }

  removeFile(i) {
    this.fileDisplayArr.splice(i, 1);
    this.fileArr.splice(i, 1);
    this.fileLimitChecker(false);
  }

  fileLimitChecker(increase) {
    const maxFile = 5;
    if (increase) {
      this.fileCount = this.fileCount + 1;
      if (this.fileCount == maxFile) {
        this.fileLimit = true;
      }
    } else {
      this.fileCount = this.fileCount - 1;
      if (this.fileCount != maxFile) {
        this.fileLimit = false;
      }
    }
  }

  submitUpdates() {
    var updatesFd = new FormData();
    updatesFd.append("description", this.updatesDescription);
    updatesFd.append("listing_id", this.listingId);
    for (var i = 0; i < this.fileArr.length; i++) {
      updatesFd.append("pic" + (i + 1), this.fileArr[i].name);
      updatesFd.append("pics", this.fileArr[i]);
      console.log("pic" + (i + 1));
    }
    this.ListingsService.CreateListingUpdates(updatesFd).subscribe((data) => {
      console.log(data);
      this.fileArr = [];
      this.fileDisplayArr = [];
      this.updatesDescription = "";
      this.fileCount = 0;
      // Get Updates
      this.ListingsService.getSelectedListingUpdates(this.listingId).subscribe(
        (data) => {
          this.UpdatesArr = data["data"];
          this.UpdatesArr.sort((a, b) => {
            return <any>new Date(b.updated_on) - <any>new Date(a.updated_on);
          });
        },
        (err) => {},
        () => {
          setTimeout(() => {
            this.initiateSlick();
          }, 500);
        }
      );
    });
  }

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

  comments;
  // Comments
  submitComments() {
    console.log(this.comments);
    this.ListingsService.CreateListingComments({
      listing_id: this.listingId,
      comment: this.comments,
    }).subscribe((data) => {
      this.comments = "";
      console.log(data);
    });
  }
  replyComments(data) {
    console.log(data);
    this.ListingsService.CreateListingComments({
      listing_id: this.listingId,
      comment: data.replyToComments,
      reply_to_id: data.listing_comment_id,
    }).subscribe((data) => {
      console.log(data);
      // Get Comments
      this.ListingsService.getSelectedListingComments(this.listingId).subscribe(
        (data) => {
          this.CommentsArr = data["data"];
          this.CommentsArr.sort((a, b) => {
            return <any>new Date(b.updated_on) - <any>new Date(a.updated_on);
          });
          console.log(this.CommentsArr);
        }
      );
    });
  }

  // UI Components

  UpdateSlicked = false;
  initiateSlick() {
    console.log("initiating Slick");
    // if (this.UpdateSlicked) {
    //   return;
    // } else {
    //   this.UpdateSlicked = true;
    //   $(".update-image-slider").slick({
    //     slidesToShow: 2,
    //     slidesToScroll: 1,
    //     dots: true,
    //     arrows: true,
    //     infinite: false,
    //     responsive: [
    //       {
    //         breakpoint: 1024,
    //         settings: {
    //           slidesToShow: 1,
    //         },
    //       },
    //     ],
    //   });
    // }

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

  liked_clicked() {
    if (this.userLikedID == "") {
      this.ListingsService.LikedListing(this.listingId).subscribe((data) => {
        $(".like-btn").toggleClass("liked");
        this.userLikedID = data["data"]["like_id"];
      });
    } else {
      this.ListingsService.UnLikedListing(this.userLikedID).subscribe(
        (data) => {
          this.userLikedID = "";
          $(".like-btn").toggleClass("liked");
        }
      );
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
}
