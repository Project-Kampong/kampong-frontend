// Angular Imports
import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

// Services
import { ListingsService } from "@app/services/listings.service";
import { ProfileService } from "@app/services/profile.service";
import { AuthService } from "@app/services/auth.service";
import { SnackbarService } from "@app/services/snackbar.service";

// Interfaces
import { Listing, ListingIndividual, ListingFAQ, ListingSkills, ListingComments, ListingJobs, ListingUpdates, ListingMilestones } from "@app/interfaces/listing";
import { Profile } from "@app/interfaces/profile";
import { P } from '@angular/cdk/keycodes';

declare var $: any;

@Component({
  selector: "app-listing-individual",
  templateUrl: "./listing-individual.component.html",
  styleUrls: ["./listing-individual.component.scss"],
})
export class ListingIndividualComponent implements OnInit {

  listingId: string;
  pics: string[];
  createdBy: string;
  listingData: ListingIndividual;
  likesArr: string[];
  imageArr: string[];
  faqArr: ListingFAQ[];
  jobsArr: ListingJobs[];
  tagsArr: string[];
  locationsArr: string[];
  updatesArr: ListingUpdates[];
  milestoneArr: ListingMilestones[];
  category: string;
  title: string;
  createdOn: string;
  isPublished: boolean;
  isVerified: boolean;
  email: string;
  status: string;
  url: string;
  mission: string;
  nickname: string;
  profilePicture: string;
  tagline: string;
  updatedOn: string;
  commentsArr: ListingComments[];
  isLiked: boolean;
  likeId: string;
  commentInput: string;
  replyInput: string;
  updateImages: File[]
  updateImagesDisplay: string[];
  updateInput: string;

  constructor( private router: Router, private route: ActivatedRoute, private listingsService: ListingsService,
    public authService: AuthService, public snackbarService: SnackbarService
  ) {
    this.listingId = "";
    this.createdBy = "";
    this.listingData = <ListingIndividual>{};
    this.likesArr = [];
    this.imageArr = [];
    this.faqArr = [];
    this.jobsArr = [];
    this.tagsArr = [];
    this.locationsArr = [];
    this.updatesArr = [];
    this.milestoneArr = [];
    this.category = "";
    this.title = "";
    this.createdOn = "";
    this.isPublished = false;
    this.isVerified = false;
    this.email = "";
    this.status = "";
    this.url = "";
    this.mission = "";
    this.nickname = "";
    this.profilePicture = "";
    this.tagline = "";
    this.updatedOn = "";
    this.commentsArr = [];
    this.pics = [];
    this.isLiked = false;
    this.likeId = "";
    this.updateImages = [];
    this.updateImagesDisplay = [];
  }

  hashID;

  SkillsList: ListingSkills[] = [];
  MilestoneArr = [];

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

    $(".navigation-tabs li").on("click", function () {
      $(".navigation-tabs li").removeClass("active");
      $(this).addClass("active");
    });
    this.tabs_selected("story");

    this.listingsService.getSelectedListing(this.listingId).subscribe(
      (data) => {
        console.log(data);
        this.listingData = data["data"];
        this.imageArr = this.listingData["pics"];
        this.likesArr = this.listingData["user_likes"];
        this.faqArr = this.listingData["faqs"];
        this.jobsArr = this.listingData["jobs"];
        this.tagsArr = this.listingData["tags"];
        this.locationsArr = this.listingData["locations"];
        this.updatesArr = this.listingData["listing_updates"];
        this.updatesArr = [];
        this.milestoneArr = this.listingData["milestones"];
        this.category = this.listingData["category"];
        this.title = this.listingData["title"];
        this.createdOn = this.listingData["created_on"];
        this.isVerified = this.listingData["is_verified"];
        this.email = this.listingData["listing_email"];
        this.status = this.listingData["listing_status"];
        this.url = this.listingData["listing_url"];
        this.mission = this.listingData["mission"];
        this.nickname = this.listingData["nickname"];
        this.profilePicture = this.listingData["profile_picture"];
        this.tagline = this.listingData["tagline"];
        this.updatedOn = this.listingData["updated_on"];
        this.createdBy = this.listingData["created_by"];
        this.pics = this.listingData["pics"];
        
        this.milestoneArr = this.milestoneArr.sort((a, b) => {
          const result: number = (new Date(a.date)).valueOf() - (new Date(b.date)).valueOf();
          return result;
        });

        this.updatesArr = this.updatesArr.sort((a, b) => {
          const result: number = (new Date(a.updated_on)).valueOf() - (new Date(b.updated_on)).valueOf();
          return result;
        });

        $("#result-overview").html(this.parseStory(this.listingData['overview']));
        $("#result-problem").html(this.parseStory(this.listingData['problem']));
        $("#result-solution").html(this.parseStory(this.listingData['solution']));
        $("#result-outcome").html(this.parseStory(this.listingData['outcome']));

        this.checkIsLiked();
      },
      (err) => {
        console.log(err);
        this.router.navigate(["/home"]);
        this.snackbarService.openSnackBar(this.snackbarService.DialogList.generic_error.error, false);
    });

  }

  loadComments(): void {
    this.listingsService.getSelectedListingComments(this.listingId).subscribe(
      (data) => {
        this.commentsArr = data["data"];
        console.log(this.commentsArr);
        this.commentsArr = this.commentsArr.sort((a, b) => {
          const result: number = (new Date(b.created_on)).valueOf() - (new Date(a.created_on)).valueOf();
          return result;
        })
      }, 
      (err) => {
        console.log(err);
        this.snackbarService.openSnackBar(this.snackbarService.DialogList.generic_error.error, false);
    })
  }

  checkIsLiked(): void {
    if (this.authService.LoggedInUserID && this.likesArr.includes(this.authService.LoggedInUserID)) {
      this.isLiked = true;
      console.log("Hi")
      $(".like-btn").addClass("liked");
      $(".like-btn").toggleClass("liked");
    }
  }

  parseStory(story: string): string {
    if (story === null) {
      return "";
    }
    const result = story.replace(/&lt;/g, "<").replace(/<a/g, "<a target='_blank'");
    return result;
  }

  uploadImage(event: Event): void {
    if (this.updateImagesDisplay.length === 5 && this.updateImages.length === 5) {
      return;
    }
    const reader: FileReader = new FileReader();
    reader.onload = (e) => {
      this.updateImagesDisplay.push(reader.result.toString());
    }
    try {
      reader.readAsDataURL((event.target as HTMLInputElement).files[0]);
    } catch (error) {
      console.log(error);
      return;
    }
    this.updateImages.push(<File>(event.target as HTMLInputElement).files[0]);
  }

  removeImage(i: number): void {
    this.updateImages.splice(i, 1);
    this.updateImagesDisplay.splice(i, 1);
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

  async postUpdate(): Promise<void> {
    (await this.listingsService.createListingUpdates(
      {
        description: this.updateInput,
        listing_id: this.listingId
      },
      this.updateImages
    )).subscribe(
      (data) => {
        this.updateImages = [];
        this.updateImagesDisplay = [];
        this.updateInput = "";
        this.snackbarService.openSnackBar(this.snackbarService.DialogList.upload_updates.success, true);
        this.router.navigate(["/listing/" + this.listingId]);
      },
      (err) => {
        console.log(err);
        this.snackbarService.openSnackBar(this.snackbarService.DialogList.upload_updates.error, false);
      },
      () => {
        setTimeout(() => {
          this.initiateSlick();
        }, 500);
      }
    )

  }

  //to refactor
  deleteUpdate(updates): void {
    if (confirm("Are you sure to delete update?")) {
      console.log(updates);
      this.listingsService.removeListingUpdates(
        updates.listing_update_id
      ).subscribe(() => {
        // Get Updates
        this.listingsService.getSelectedListingUpdates(
          this.listingId
        ).subscribe(
          (data) => {
            this.snackbarService.openSnackBar(
              this.snackbarService.DialogList.delete_updates.success,
              true
            );
            this.updatesArr = data["data"];
            this.updatesArr.sort((a, b) => {
              return <any>new Date(b.updated_on) - <any>new Date(a.updated_on);
            });
          },
          (err) => {
            this.snackbarService.openSnackBar(
              this.snackbarService.DialogList.delete_updates.error,
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

  postComment(): void {
    this.listingsService.createListingComments({
      listing_id: this.listingId,
      comment: this.commentInput
    }).subscribe(
      (data) => {
        this.commentInput = "";
        this.snackbarService.openSnackBar(this.snackbarService.DialogList.upload_comments.success, true);
      },
      (err) => {
        console.log(err);
        this.commentInput = "";
        this.snackbarService.openSnackBar(this.snackbarService.DialogList.upload_comments.error, false);
      },
      () => {
        this.loadComments();
      }
    )
  }

  replyComment(comment: ListingComments): void {
    this.listingsService.createListingComments({
      listing_id: this.listingId,
      comment: this.replyInput,
      reply_to_id: comment.listing_comment_id,
    }).subscribe(
      (data) => {
        this.replyInput = "";
        this.snackbarService.openSnackBar(this.snackbarService.DialogList.upload_comments.success, true);
      },
      (err) => {
        console.log(err);
        this.replyInput = "";
        this.snackbarService.openSnackBar(this.snackbarService.DialogList.upload_comments.error, false);
      },
      () => {
        this.loadComments();
      }
    )
  }

  deleteComment(comment: ListingComments) {
    if (confirm("Delete comment?")) {
      this.listingsService.removeListingComments(comment.listing_comment_id).subscribe(
        (data) => {
          this.snackbarService.openSnackBar(this.snackbarService.DialogList.delete_comments.success, true);
        },
        (err) => {
          this.snackbarService.openSnackBar(this.snackbarService.DialogList.delete_comments.error, false);
        },
        () => {
          this.loadComments();
        }
      )
    }
  }

  initiateSlick(): void {
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

  handle_like(): void {
    if (!this.authService.isLoggedIn) {
      this.snackbarService.openSnackBar(this.snackbarService.DialogList.like_listing.unauthorized, false);
      return;
    }
    if (!this.isLiked) {
      this.listingsService.likeListing(this.listingId).subscribe(
        (data) => {
          this.likesArr.push(data["data"]["user_id"]);
          this.isLiked = true;
          this.likeId = data["data"]["like_id"]; //to change
          this.snackbarService.openSnackBar(this.snackbarService.DialogList.like_listing.liked, true);
        },
        (err) => {
          console.log(err);
          this.snackbarService.openSnackBar(this.snackbarService.DialogList.like_listing.error, false);
          return;
        }
      )
    } else {
      this.listingsService.unlikeListing(this.likeId).subscribe(
        (data) => {
          this.likesArr.splice(this.likesArr.indexOf(this.authService.LoggedInUserID), 1);
          this.isLiked = false;
          this.likeId = "";
          this.snackbarService.openSnackBar(this.snackbarService.DialogList.like_listing.unliked, true);
        },
        (err) => {
          console.log(err);
          this.snackbarService.openSnackBar(this.snackbarService.DialogList.like_listing.error, false);
          return;
        }
      )
    }

  }

  tabs_selected(selected: string): void {
    $(".tabs-content").hide();
    switch(selected) {
      case "updates":
        this.initiateSlick();
        break;
      case "comments":
        this.loadComments();
    }
    $("#" + selected).show();
  }

  clickOnProfile(user_id: string): void {
    this.router.navigate(["/profile/" + user_id]);
  }

  editListing(listing_id: string): void {
    this.router.navigate(["/edit/" + listing_id]);
  }

  togglePopup(): void {
    $(".popup-bg").toggleClass("active");
    $(".popup-box").toggleClass("active");
  }

  sendMessage() {
    if (this.enquireMessage != "") {
      this.togglePopup();
      this.listingsService.sendEnquiry({
        receiverEmail: this.listingData.listing_email,
        subject: this.enquireTopic,
        message: this.enquireMessage,
      }).subscribe(
        (data) => {
          this.snackbarService.openSnackBar(
            this.snackbarService.DialogList.send_message.success,
            true
          ),
            (err) => {
              this.snackbarService.openSnackBar(
                this.snackbarService.DialogList.send_message.error,
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


}
