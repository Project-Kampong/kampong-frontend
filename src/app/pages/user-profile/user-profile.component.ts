// Angular Imports
import { FormGroup, ValidationErrors } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';

// Services
import { AuthService } from '@app/services/auth.service';
import { ProfileService } from '@app/services/profile.service';
import { SnackbarService } from '@app/services/snackbar.service';

// Interfaces
import { Profile } from '@app/interfaces/profile';
import { Listing } from '@app/interfaces/listing';
import { Organisation } from '@app/interfaces/organisation';
import { UserData } from '@app/interfaces/user';
import { Subscription } from 'rxjs';
import { UsersService } from '@app/services/users.service';

declare var $: any;

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit, OnDestroy {
  editProfileForm: FormGroup;
  profileData: Profile = <Profile>{};
  likedArr: Listing[] = [];
  startedArr: Listing[] = [];
  likeCount: number = 0;
  orgArr: Organisation[] = [];
  private userData: UserData = <UserData>{};
  isLoggedIn: boolean = false;
  subscriptions: Subscription[] = [];
  isEditingProfile: boolean = false;

  constructor(
    private authService: AuthService,
    private profileService: ProfileService,
    private userService: UsersService,
    private snackbarService: SnackbarService,
  ) {}

  ngOnInit() {
    if (this.authService.checkCookie()) {
      this.subscriptions.push(
        this.authService.getUserDataByToken().subscribe(
          (res) => {
            this.userData = res['data'];
            this.subscriptions.push(
              this.profileService.getUserProfile(this.userData['user_id']).subscribe(
                (res) => {
                  this.profileData = res['data'];
                  this.isLoggedIn = true;
                },
                (err) => {
                  console.log(err);
                },
              ),
            );
          },
          (err) => {
            console.log(err);
            console.log('User is not logged in');
          },
          () => {
            this.subscriptions.push(
              this.userService.getLikedListing(this.userData['user_id']).subscribe(
                (res) => {
                  this.likeCount = res['count'];
                  this.likedArr = res['data'];
                },
                (err) => {
                  console.log(err);
                },
              ),
            );
            this.subscriptions.push(
              this.userService.getOwnedListings(this.userData['user_id']).subscribe((res) => {
                res['data'].map((x) => {
                  if (x.deleted_on === null) {
                    this.startedArr.push(x);
                  }
                });
              }),
            );
          },
        ),
      );
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  editProfile() {
    this.isEditingProfile = !this.isEditingProfile;
  }

  discardChanges() {
    this.isEditingProfile = !this.isEditingProfile;
    // this.getInitDataWithoutListings();
  }

  selectedFile;
  uploadFile(event) {
    this.selectedFile = <File>event.target.files[0];
    // Display Image
    var reader: FileReader = new FileReader();
    reader.onload = (e) => {
      // this.fileDisplayArr.push(reader.result.toString());
      this.profileData.profile_picture = reader.result.toString();
    };
    reader.readAsDataURL(event.target.files[0]);
  }

  scrollToSection(id) {
    console.log($('#' + id).offset().top);
    var scrollAmt = $('#' + id).offset().top - 20;
    $('.profile-nav li').removeClass('active');
    $('#' + id + '-nav').addClass('active');
    $('html, body').animate({ scrollTop: scrollAmt }, 50);
  }

  saveProfile() {
    this.isEditingProfile = false;
    this.profileService.updateUserProfile(this.profileData['user_id'], this.editProfileForm.value).subscribe(
      (res) => {
        if (this.selectedFile != null) {
          var ImageFd = new FormData();
          ImageFd.append('pic', this.selectedFile);
          this.profileService.updateUserProfilePic(this.profileData['user_id'], ImageFd).subscribe(
            (res) => {
              window.location.reload(); //because there is some additional listing bug
            },
            (err) => {
              console.log('error');
            },
          );
        } else {
          this.snackbarService.openSnackBar(this.snackbarService.DialogList.update_profile.success, true);
          window.location.reload(); //because there is some additional listing bug
        }
      },
      (err) => {
        console.log('error');
        this.snackbarService.openSnackBar(this.snackbarService.DialogList.update_profile.error, false);
        window.location.reload(); //because there is some additional listing bug
      },
    );
  }

  getFormValidationErrors() {
    var error = false;
    Object.keys(this.editProfileForm.controls).forEach((key) => {
      const controlErrors: ValidationErrors = this.editProfileForm.get(key).errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach((keyError) => {
          error = true;
        });
      }
    });
    return error;
  }
}
