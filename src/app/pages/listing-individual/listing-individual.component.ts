// Angular Imports
import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

// Services

import { ListingsService } from "@app/services/listings.service";
import { ProfileService } from "@app/services/profile.service";
import { AuthService } from "@app/services/auth.service";
import { SnackbarService } from "@app/services/snackbar.service";

// Interface
import {
  Listing,
  defaultListing,
  ListingFAQ,
  ListingSkills,
  ListingComments,
} from "@app/interfaces/listing";
import { Profile } from "@app/interfaces/profile";

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
    public AuthService: AuthService,
    public SnackbarService: SnackbarService
  ) {}

  listingId;
  hashID;

  // Data Arr
  ListingData: Listing = <Listing>{};
  ProfileInfo: Profile = <Profile>{};
  Hashtags = [];
  SkillsList: ListingSkills[] = [];
  MilestoneArr = [];
  // Faq
  FAQList: ListingFAQ[];
  // Comments
  CommentsArr = [];
  // Updates
  UpdatesArr = [];
  // Locations
  ListingLocation = [];

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
  updatesFormOpen = false;
  locationList = [];

  // Email
  enquireMessage: String = "";
  enquireTopic: String = "";

  ngOnInit() {
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
    // Static
    this.ListingsService.getAllLocations().subscribe((data) => {
      console.log(data);
      this.locationList = data["data"];
    });

    // Get Listing Info
    this.ListingsService.getSelectedListing(this.listingId).subscribe(
      (data) => {
        this.ListingData = data["data"];
        this.SliderImageArr = this.ListingData["pics"];
        this.ListingData.overview = this.ListingData["overview"]
          .replace(/&lt;/g, "<")
          .replace(/<a/g, "<a target='_blank'");
        this.ListingData.problem = this.ListingData["problem"]
          .replace(/&lt;/g, "<")
          .replace(/<a/g, "<a target='_blank'");
        this.ListingData.solution = this.ListingData["solution"]
          .replace(/&lt;/g, "<")
          .replace(/<a/g, "<a target='_blank'");
        this.ListingData.outcome = this.ListingData["outcome"]
          .replace(/&lt;/g, "<")
          .replace(/<a/g, "<a target='_blank'");

        $("#result-overview").html(this.ListingData.overview);
        $("#result-problem").html(this.ListingData.problem);
        $("#result-solution").html(this.ListingData.solution);
        $("#result-outcome").html(this.ListingData.outcome);
        console.log(this.ListingData);
        console.log(this.SliderImageArr);
        this.ProfileService.getUserProfile(
          this.ListingData["created_by"]
        ).subscribe((profile) => {
          this.ProfileInfo = profile["data"];
          if (this.ProfileInfo.profile_picture == null) {
            this.ProfileInfo.profile_picture =
              "https://www.nicepng.com/png/full/128-1280406_view-user-icon-png-user-circle-icon-png.png";
          }
        });

        if (this.AuthService.isLoggedIn) {
          // Check User Liked List
          this.ListingsService.getLikedListing().subscribe((data) => {
            const likedArr = data["data"];
            for (var i = 0; i < likedArr.length; i++) {
              if (likedArr[i].listing_id == this.listingId) {
                this.userLikedID = likedArr[i].like_id;
                $(".like-btn").addClass("liked");
              }
            }
          });
        }
      },
      (err) => {
        this.router.navigate(["/home"]);
      },
      () => {
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

        this.ListingsService.getSelectedListingJobs(this.listingId).subscribe(
          (data) => {
            this.SkillsList = data["data"];
            console.log(this.SkillsList);
          }
        );

        // Get Hashtags
        this.ListingsService.getSelectedListingHashtags(
          this.listingId
        ).subscribe((data) => {
          this.Hashtags = data["data"];
        });

        // Get Location
        this.ListingsService.getSelectedListingLocations(
          this.listingId
        ).subscribe((data) => {
          this.ListingLocation = data["data"];
        });

        // Get Comments
        this.ListingsService.getSelectedListingComments(
          this.listingId
        ).subscribe((data) => {
          this.CommentsArr = data["data"];
          this.CommentsArr.sort((a, b) => {
            return <any>new Date(b.updated_on) - <any>new Date(a.updated_on);
          });
        });

        // Get Updates
        this.ListingsService.getSelectedListingUpdates(
          this.listingId
        ).subscribe((data) => {
          this.UpdatesArr = data["data"];
          this.UpdatesArr.sort((a, b) => {
            return <any>new Date(b.updated_on) - <any>new Date(a.updated_on);
          });
          // this.initiateSlick();
        });

        // Get Milestones
        this.ListingsService.getSelectedListingMilestones(
          this.listingId
        ).subscribe((data) => {
          this.MilestoneArr = data["data"];
          this.MilestoneArr.sort((a, b) => {
            return <any>new Date(a.date) - <any>new Date(b.date);
          });
        });

        // End of Data Retrive
      }
    );
  }

  // File Upload
  selectedFile: File = null;
  updatesDescription;
  uploadFile(event) {
    this.selectedFile = <File>event.target.files[0];
    // Display Image
    const reader = new FileReader();
    reader.onload = (e) => {
      this.fileDisplayArr.push(reader.result.toString());
    };
    reader.readAsDataURL(event.target.files[0]);
    this.fileLimitChecker(true);
    this.fileArr.push(this.selectedFile);
    console.log(this.fileArr);
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
          this.SnackbarService.openSnackBar(
            this.SnackbarService.DialogList.upload_updates.success,
            true
          );
          this.UpdatesArr = data["data"];
          this.UpdatesArr.sort((a, b) => {
            return <any>new Date(b.updated_on) - <any>new Date(a.updated_on);
          });
        },
        (err) => {
          this.SnackbarService.openSnackBar(
            this.SnackbarService.DialogList.upload_updates.error,
            false
          );
        },
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
      // Get Comments
      this.ListingsService.getSelectedListingComments(this.listingId).subscribe(
        (data) => {
          this.SnackbarService.openSnackBar(
            this.SnackbarService.DialogList.upload_comments.success,
            true
          );
          this.CommentsArr = data["data"];
          this.CommentsArr.sort((a, b) => {
            return <any>new Date(b.updated_on) - <any>new Date(a.updated_on);
          });
          console.log(this.CommentsArr);
        }
      );
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
          this.SnackbarService.openSnackBar(
            this.SnackbarService.DialogList.upload_comments.success,
            true
          );
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
    if (!this.AuthService.isLoggedIn) {
      this.SnackbarService.openSnackBar("Please login to like", true);
      return;
    } else {
      if (this.userLikedID == "") {
        this.ListingsService.LikedListing(this.listingId).subscribe((data) => {
          this.SnackbarService.openSnackBar(
            this.SnackbarService.DialogList.liked_listing.liked,
            true
          );
          $(".like-btn").toggleClass("liked");
          this.listingLikes = this.listingLikes + 1;
          this.userLikedID = data["data"]["like_id"];
        });
      } else {
        this.ListingsService.UnLikedListing(this.userLikedID).subscribe(
          (data) => {
            this.SnackbarService.openSnackBar(
              this.SnackbarService.DialogList.liked_listing.unliked,
              true
            );
            this.userLikedID = "";
            $(".like-btn").toggleClass("liked");
            this.listingLikes = this.listingLikes - 1;
          }
        );
      }
    }
  }

  tabs_selected(selected: string): void {
    $(".tabs-content").hide();
    $("#" + selected).show();
    if (selected == "updates") {
      this.initiateSlick();
    }
  }

  selectedProfile(user_id: string): void {
    this.router.navigate(["/profile/" + user_id]);
  }

  editListing(listing_id: string): void {
    this.router.navigate(["/edit/" + listing_id]);
  }

  // Toggle Enquire popup
  togglePopup(): void {
    // Toggle popup
    $(".popup-bg").toggleClass("active");
    $(".popup-box").toggleClass("active");
  }

  sendMessage() {
    if (this.enquireMessage != "") {
      this.togglePopup();
      this.ListingsService.sendEnquiry({
        receiverEmail: this.ListingData.listing_email,
        subject: this.enquireTopic,
        message: this.enquireMessage,
      }).subscribe(
        (data) => {
          this.SnackbarService.openSnackBar(
            this.SnackbarService.DialogList.send_message.success,
            true
          ),
            (err) => {
              this.SnackbarService.openSnackBar(
                this.SnackbarService.DialogList.send_message.error,
                false
              );
            };
        },
        () => {
          setTimeout(() => {
            this.initiateSlick();
          }, 500);
        }
      );
    }
  }

  // Delete
  deleteUpdate(updates) {
    if (confirm("Are you sure to delete update?")) {
      console.log(updates);
      this.ListingsService.removeListingUpdates(
        updates.listing_update_id
      ).subscribe(() => {
        // Get Updates
        this.ListingsService.getSelectedListingUpdates(
          this.listingId
        ).subscribe(
          (data) => {
            this.SnackbarService.openSnackBar(
              this.SnackbarService.DialogList.delete_updates.success,
              true
            );
            this.UpdatesArr = data["data"];
            this.UpdatesArr.sort((a, b) => {
              return <any>new Date(b.updated_on) - <any>new Date(a.updated_on);
            });
          },
          (err) => {
            this.SnackbarService.openSnackBar(
              this.SnackbarService.DialogList.delete_updates.error,
              false
            );
          },
          () => {
            setTimeout(() => {
              this.initiateSlick();
            }, 500);
          }
        );
      });
    }
  }

  deleteComments(comment) {
    if (confirm("Are you sure to delete comment?")) {
      console.log(comment);
      this.ListingsService.removeListingComments(
        comment.listing_comment_id
      ).subscribe(() => {
        this.SnackbarService.openSnackBar(
          this.SnackbarService.DialogList.delete_comments.success,
          true
        );
        // Get Comments
        this.ListingsService.getSelectedListingComments(
          this.listingId
        ).subscribe((data) => {
          this.CommentsArr = data["data"];
          this.CommentsArr.sort((a, b) => {
            return <any>new Date(b.updated_on) - <any>new Date(a.updated_on);
          });
          console.log(this.CommentsArr);
        });
      });
    }
  }
}
