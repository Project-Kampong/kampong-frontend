// Angular Imports
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

// Services
import { ListingsService } from '@app/services/listings.service';
import { AuthService } from '@app/services/auth.service';
import { SnackbarService } from '@app/services/snackbar.service';

// Interfaces
import {
  ListingIndividual,
  ListingFAQ,
  ListingComments,
  ListingJobs,
  ListingUpdates,
  ListingMilestones,
  ListingLikes,
} from '@app/interfaces/listing';
import { Subscription } from 'rxjs';
import { UserData } from '@app/interfaces/user';
import { EmailService } from '@app/services/email.service';

import { uiStore } from '@app/store/ui-store';
import { MatDialog } from '@angular/material';
import { DialogComponent } from '@app/components/dialog/dialog.component';

declare var $: any;

@Component({
  selector: 'app-listing-individual',
  templateUrl: './listing-individual.component.html',
  styleUrls: ['./listing-individual.component.scss'],
})
export class ListingIndividualComponent implements OnInit, OnDestroy {
  listingId: string = '';
  pics: string[] = [];
  createdBy: string = '';
  listingData: ListingIndividual = <ListingIndividual>{};
  likesArr: ListingLikes[] = [];
  imageArr: string[] = [];
  faqArr: ListingFAQ[] = [];
  jobsArr: ListingJobs[] = [];
  tagsArr: string[] = [];
  locationsArr: string[] = [];
  updatesArr: ListingUpdates[] = [];
  milestoneArr: ListingMilestones[] = [];
  category: string = '';
  title: string = '';
  createdOn: string = '';
  isPublished: boolean = false;
  isVerified: boolean = false;
  email: string = '';
  status: string = '';
  url: string = '';
  mission: string = '';
  nickname: string = '';
  profilePicture: string = '';
  tagline: string = '';
  updatedOn: string = '';
  commentsArr: ListingComments[] = [];
  isLiked: boolean = false;
  likeId: number;
  commentInput: string = '';
  replyInput: string = '';
  updateImages: File[] = [];
  updateImagesDisplay: string[] = [];
  updateInput: string = '';
  updatesFormOpen: boolean = false;
  currentDate: Date = new Date();
  enquireMessage: string = '';
  enquireTopic: string = '';
  subscriptions: Subscription[] = [];
  isLoggedIn: boolean;
  userData: UserData = <UserData>{};
  uiStore = uiStore;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private listingsService: ListingsService,
    private authService: AuthService,
    private snackbarService: SnackbarService,
    private emailService: EmailService,
    private dialog: MatDialog,
  ) {}

  ngOnInit() {
    window.scroll(0, 0);
    this.listingId = this.route.snapshot.params['id'];

    if (this.authService.checkCookie()) {
      this.subscriptions.push(
        this.authService.getUserDataByToken().subscribe(
          (res) => {
            this.userData = res['data'];
            this.isLoggedIn = true;
          },
          (err) => {
            console.log(err);
            console.log('User is not logged in');
          },
        ),
      );
    }

    $('.navigation-tabs li').on('click', function () {
      $('.navigation-tabs li').removeClass('active');
      $(this).addClass('active');
    });

    this.tabs_selected('story');

    this.subscriptions.push(
      this.listingsService.getSelectedListing(this.listingId).subscribe(
        (data) => {
          this.listingData = data['data'];
          this.imageArr = this.listingData['pics'];
          this.likesArr = this.listingData['user_likes'];
          this.faqArr = this.listingData['faqs'];
          this.jobsArr = this.listingData['jobs'];
          this.tagsArr = this.listingData['tags'];
          this.locationsArr = this.listingData['locations'];
          this.updatesArr = this.listingData['listing_updates'];
          this.milestoneArr = this.listingData['milestones'];
          this.category = this.listingData['category'];
          this.title = this.listingData['listing_title'];
          this.createdOn = this.listingData['created_on'];
          this.isVerified = this.listingData['is_verified'];
          this.email = this.listingData['listing_email'];
          this.status = this.listingData['listing_status'];
          this.url = this.listingData['listing_url'];
          this.mission = this.listingData['mission'];
          this.nickname = this.listingData['nickname'];
          this.profilePicture = this.listingData['profile_picture'];
          this.tagline = this.listingData['tagline'];
          this.updatedOn = this.listingData['updated_on'];
          this.createdBy = this.listingData['created_by'];
          this.pics = this.listingData['pics'];

          this.milestoneArr = this.milestoneArr.sort((a, b) => {
            const result: number = new Date(a.date).valueOf() - new Date(b.date).valueOf();
            return result;
          });

          this.updatesArr = this.updatesArr.sort((a, b) => {
            const result: number = new Date(b.updated_on).valueOf() - new Date(a.updated_on).valueOf();
            return result;
          });

          $('#result-overview').html(this.parseStory(this.listingData['overview']));
          $('#result-problem').html(this.parseStory(this.listingData['problem']));
          $('#result-solution').html(this.parseStory(this.listingData['solution']));
          $('#result-outcome').html(this.parseStory(this.listingData['outcome']));

          this.checkIsLiked();
        },
        (err) => {
          console.log(err);
          this.router.navigate(['/home']);
          this.snackbarService.openSnackBar(this.snackbarService.DialogList.generic_error.error, false);
        },
      ),
    );
  }

  loadComments(): void {
    this.subscriptions.push(
      this.listingsService.getSelectedListingComments(this.listingId).subscribe(
        (data) => {
          this.commentsArr = data['data'];
          this.commentsArr = this.commentsArr.sort((a, b) => {
            const result: number = new Date(b.created_on).valueOf() - new Date(a.created_on).valueOf();
            return result;
          });
        },
        (err) => {
          console.log(err);
          this.snackbarService.openSnackBar(this.snackbarService.DialogList.generic_error.error, false);
        },
      ),
    );
  }

  /*
  //To think through the fastest way
  groupComments(commentsArr: ListingComments[]): any {
    const result = commentsArr.filter((comment) => comment.reply_to_id === null);
    commentsArr.forEach((val) => {
      if (val.reply_to_id) {
        //it is a reply
        console.log(val);
      }
    });
  }
  */

  checkIsLiked(): void {
    this.likesArr.forEach((val) => {
      if (this.isLoggedIn && val['user_id'] === this.userData['user_id']) {
        this.isLiked = true;
        this.likeId = val['like_id'];
        $('.like-btn').addClass('liked');
      }
    });
  }

  parseStory(story: string): string {
    if (story === null) {
      return '';
    }
    const result = story.replace(/&lt;/g, '<').replace(/<a/g, "<a target='_blank'");
    return result;
  }

  uploadImage(event: Event): void {
    if (this.updateImagesDisplay.length === 5 && this.updateImages.length === 5) {
      return;
    }
    const reader: FileReader = new FileReader();
    reader.onload = (e) => {
      this.updateImagesDisplay.push(reader.result.toString());
    };
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

  async postUpdate(): Promise<void> {
    this.subscriptions.push(
      (
        await this.listingsService.createListingUpdates({
          description: this.updateInput,
          listing_id: this.listingId,
        })
      ).subscribe(
        (data) => {
          this.updateImages = [];
          this.updateImagesDisplay = [];
          this.updateInput = '';
          this.snackbarService.openSnackBar(this.snackbarService.DialogList.upload_updates.success, true);
        },
        (err) => {
          console.log(err);
          this.snackbarService.openSnackBar(this.snackbarService.DialogList.upload_updates.error, false);
        },
        () => {
          setTimeout(() => {
            this.initiateSlick();
          }, 500);
          this.reloadCurrentRoute();
        },
      ),
    );
  }

  deleteUpdate(updates: ListingUpdates): void {
    if (confirm('Delete update?')) {
      this.listingsService.removeListingUpdates(updates.listing_update_id).subscribe(
        (data) => {
          this.snackbarService.openSnackBar(this.snackbarService.DialogList.delete_updates.success, true);
        },
        (err) => {
          console.log(err);
          this.snackbarService.openSnackBar(this.snackbarService.DialogList.delete_updates.error, false);
        },
        () => {
          setTimeout(() => {
            this.initiateSlick();
          }, 500);
          this.reloadCurrentRoute();
        },
      );
    }
  }

  // To refactor
  getDiffInTime(time: string): string {
    const diff = (this.currentDate.getTime() - new Date(time).getTime()) / 1000;
    const hh = Math.floor(diff / (60 * 60));
    const dd = Math.floor(diff / (60 * 60 * 24));
    const mm = Math.floor(diff / (60 * 60 * 24 * 30));
    const yy = Math.floor(diff / (60 * 60 * 24 * 30 * 12));
    if (hh > 24) {
      if (dd > 30) {
        if (mm > 12) {
          if (yy > 1) {
            return yy + ' Years ago';
          } else {
            return yy + ' Year ago';
          }
        } else {
          if (mm > 1) {
            return mm + ' Months ago';
          } else {
            return mm + ' Month ago';
          }
        }
      } else {
        if (dd > 1) {
          return dd + ' Days ago';
        } else {
          return dd + ' Day ago';
        }
      }
    } else if (hh < 1) {
      return 'Less than 1 Hour ago';
    } else {
      if (hh > 1) {
        return hh + ' Hours ago';
      } else {
        return hh + ' Hour ago';
      }
    }
  }

  postComment(): void {
    this.listingsService
      .createListingComments({
        listing_id: this.listingId,
        comment: this.commentInput,
      })
      .subscribe(
        (data) => {
          this.commentInput = '';
          this.snackbarService.openSnackBar(this.snackbarService.DialogList.upload_comments.success, true);
        },
        (err) => {
          console.log(err);
          this.commentInput = '';
          this.snackbarService.openSnackBar(this.snackbarService.DialogList.upload_comments.error, false);
        },
        () => {
          this.loadComments();
        },
      );
  }

  replyComment(comment: ListingComments): void {
    this.listingsService
      .createListingComments({
        listing_id: this.listingId,
        comment: this.replyInput,
        reply_to_id: comment.listing_comment_id,
      })
      .subscribe(
        (data) => {
          this.replyInput = '';
          this.snackbarService.openSnackBar(this.snackbarService.DialogList.upload_comments.success, true);
        },
        (err) => {
          console.log(err);
          this.replyInput = '';
          this.snackbarService.openSnackBar(this.snackbarService.DialogList.upload_comments.error, false);
        },
        () => {
          this.loadComments();
        },
      );
  }

  deleteComment(comment: ListingComments) {
    if (confirm('Delete comment?')) {
      this.listingsService.removeListingComments(comment.listing_comment_id).subscribe(
        (data) => {
          this.snackbarService.openSnackBar(this.snackbarService.DialogList.delete_comments.success, true);
        },
        (err) => {
          this.snackbarService.openSnackBar(this.snackbarService.DialogList.delete_comments.error, false);
        },
        () => {
          this.loadComments();
        },
      );
    }
  }

  initiateSlick(): void {
    if (!$('.update-image-slider').hasClass('slick-initialized')) {
      $('.update-image-slider').slick({
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
      $('.update-image-slider').slick('unslick');
      this.initiateSlick();
    }
  }

  handle_like(): void {
    if (!this.isLoggedIn) {
      this.snackbarService.openSnackBar(this.snackbarService.DialogList.like_listing.unauthorized, false);
      return;
    }
    if (!this.isLiked) {
      this.subscriptions.push(
        this.listingsService.likeListing(this.listingId).subscribe(
          (data) => {
            this.likesArr.push({ like_id: data['data']['like_id'], user_id: data['data']['user_id'] });
            this.isLiked = true;
            this.likeId = data['data']['like_id'];
            this.snackbarService.openSnackBar(this.snackbarService.DialogList.like_listing.liked, true);
          },
          (err) => {
            console.log(err);
            this.snackbarService.openSnackBar(this.snackbarService.DialogList.like_listing.error, false);
            return;
          },
        ),
      );
    } else {
      this.subscriptions.push(
        this.listingsService.unlikeListing(this.likeId).subscribe(
          (data) => {
            this.likesArr.splice(this.likesArr.map((like) => like['user_id']).indexOf(this.userData['user_id']), 1);
            this.isLiked = false;
            this.likeId = null;
            this.snackbarService.openSnackBar(this.snackbarService.DialogList.like_listing.unliked, true);
          },
          (err) => {
            console.log(err);
            this.snackbarService.openSnackBar(this.snackbarService.DialogList.like_listing.error, false);
            return;
          },
        ),
      );
    }
  }

  reloadCurrentRoute(): void {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  tabs_selected(selected: string): void {
    $('.tabs-content').hide();
    switch (selected) {
      case 'updates':
        this.initiateSlick();
        break;
      case 'comments':
        this.loadComments();
    }
    $('#' + selected).show();
  }

  clickOnProfile(user_id: string): void {
    this.router.navigate(['/profile/' + user_id]);
  }

  editListing(listing_id: string): void {
    this.router.navigate(['/edit/' + listing_id]);
  }

  togglePopup(): void {
    $('.popup-bg').toggleClass('active');
    $('.popup-box').toggleClass('active');
  }

  toggleEmailPopup() {
    // Toggle popup
    $('.popup-bg').toggleClass('active');
    $('.popup-email').toggleClass('active');
  }
  sendMessage() {
    if (this.enquireMessage != '') {
      this.togglePopup();
      uiStore.toggleLoading();
      this.emailService
        .sendEnquiry({
          listingId: this.listingId,
          subject: this.enquireTopic,
          message: this.enquireMessage,
        })
        .subscribe(
          (data) => {
            this.snackbarService.openSnackBar(this.snackbarService.DialogList.send_message.success, true),
              (err) => {
                console.log(err);
                this.snackbarService.openSnackBar(this.snackbarService.DialogList.send_message.error, false);
              };
          },
          (err) => {
            console.log(err);
            uiStore.toggleLoading();
          },
          () => {
            // setTimeout(() => {
            //   this.initiateSlick();
            // }, 500);
            uiStore.toggleLoading();
          },
        );
    }
  }

  applyJob(job) {
    if (this.isLoggedIn) {
      const dialogRef = this.dialog.open(DialogComponent, {
        data: {
          title: 'Job Application',
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
        uiStore.toggleLoading();
        if (result) {
          this.emailService
            .sendApplication({
              listingId: this.listingId,
              roleApplied: job['job_title'],
            })
            .subscribe(
              (data) => {
                this.snackbarService.openSnackBar(this.snackbarService.DialogList.send_application.success, true);
              },
              (error) => {
                uiStore.toggleLoading();
                console.log(error);
                this.snackbarService.openSnackBar(this.snackbarService.DialogList.send_application.error, false);
              },
              () => {
                uiStore.toggleLoading();
              },
            );
        } else {
          uiStore.toggleLoading();
        }
      });
    } else {
      this.snackbarService.openSnackBar('Please login first', false);
      this.router.navigate(['/login']);
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
