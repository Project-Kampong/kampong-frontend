// Angular Imports
import { Component, OnInit, ɵɵcontainerRefreshEnd } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  ValidationErrors,
} from "@angular/forms";

// Services
import { ListingsService } from "@app/services/listings.service";
import { AuthService } from "@app/services/auth.service";
import { ProfileService } from "@app/services/profile.service";
import { OrganisationsService } from '@app/services/organisations.service';
import { SnackbarService } from "@app/services/snackbar.service";

// Interfaces
import { Profile, DefaultProfile } from "@app/interfaces/profile";
import { Listing } from "@app/interfaces/listing";
import { Organisation } from "@app/interfaces/organisation";

declare var $: any;

@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.scss"],
})
export class UserProfileComponent implements OnInit {

  EditProfileForm: FormGroup;
  profileDetails: Profile;
  likedArr: Listing[];
  startedArr: Listing[];
  likeCount: number;
  orgArr: Organisation[];
  isEditingProfile = false;

  constructor(
    private fb: FormBuilder,
    public listingsService: ListingsService,
    public authService: AuthService,
    public profileService: ProfileService,
    public organisationService: OrganisationsService,
    public snackbarService: SnackbarService
  ) {
    this.likedArr = [];
    this.startedArr = [];
    this.orgArr = [];
    this.likeCount = 0;
  }

  ngOnInit() {
    this.EditProfileForm = this.fb.group({
      ...DefaultProfile,
    });

    if (this.authService.isLoggedIn) {
      this.getInitData();
    }

    this.authService.LoginResponse.subscribe(() => {
      this.getInitData();
    });

    window.scrollTo(0,0);
  }

  getInitDataWithoutListings() { 
    this.profileService.getUserProfile(
      this.authService.LoggedInUserID
    ).subscribe((data) => {
      this.profileDetails = data["data"];
      this.EditProfileForm.patchValue(this.profileDetails);
      if (this.profileDetails.profile_picture == null) {
        this.profileDetails.profile_picture =
          "https://www.nicepng.com/png/full/128-1280406_view-user-icon-png-user-circle-icon-png.png";
      }
    });
  }

  getInitData() {
    this.profileService.getUserProfile(
      this.authService.LoggedInUserID
    ).subscribe((data) => {
      this.profileDetails = data["data"];
      this.EditProfileForm.patchValue(this.profileDetails);
      if (this.profileDetails.profile_picture == null) {
        this.profileDetails.profile_picture =
          "https://www.nicepng.com/png/full/128-1280406_view-user-icon-png-user-circle-icon-png.png";
      }
    });

    // Liked
    this.listingsService.getLikedListing().subscribe((data) => {
      this.likeCount = data["count"];
      this.likedArr = data["data"];
    });
    // Started
    this.listingsService.getPublicOwnedListings(
      this.authService.LoggedInUserID
    ).subscribe((data) => {
      data["data"].map((x) => {
        if (x.deleted_on == null) {
          this.startedArr.push(x);
        }
      });
    });

    this.organisationService.getOrganisations(1).subscribe(
      (res) => {
        console.log(res);
        this.orgArr = res["data"].filter((org) => (
          org["owned_by"] === this.authService.LoggedInUserID
        ))
      }
    );
  }

  editProfile() { 
    this.isEditingProfile = !this.isEditingProfile;
  }

  discardChanges() { 
    this.isEditingProfile = !this.isEditingProfile;
    this.getInitDataWithoutListings();
  }

  selectedFile;
  uploadFile(event) {
    this.selectedFile = <File>event.target.files[0];
    // Display Image
    var reader: FileReader = new FileReader();
    reader.onload = (e) => {
      // this.fileDisplayArr.push(reader.result.toString());
      this.profileDetails.profile_picture = reader.result.toString();
    };
    reader.readAsDataURL(event.target.files[0]);
  }

  scrollToSection(id) {
    console.log($("#" + id).offset().top);
    var scrollAmt = $("#" + id).offset().top - 20;
    $(".profile-nav li").removeClass("active");
    $("#" + id + "-nav").addClass("active");
    $("html, body").animate({ scrollTop: scrollAmt }, 50);
  }

  saveProfile() {
    this.isEditingProfile = false;
    this.profileService.updateUserProfile(
      this.profileDetails["user_id"],
      this.EditProfileForm.value
    ).subscribe(
      (res) => {
        if (this.selectedFile != null) {
          var ImageFd = new FormData();
          ImageFd.append("pic", this.selectedFile);
          this.profileService.updateUserProfilePic(
            this.profileDetails["user_id"],
            ImageFd
          ).subscribe(
            (res) => {
              this.authService.LoginResponse.emit();
              window.location.reload(); //because there is some additional listing bug
            },
            (err) => {
              console.log("error");
            }
          );
        } else {
          this.authService.LoginResponse.emit() 
          this.snackbarService.openSnackBar(
            this.snackbarService.DialogList.update_profile.success,
            true
          );
          window.location.reload(); //because there is some additional listing bug
        }
      },
      (err) => {
        console.log("error");
        this.snackbarService.openSnackBar(
          this.snackbarService.DialogList.update_profile.error,
          false
        );
        window.location.reload(); //because there is some additional listing bug
      }
    );
  }
  
  getFormValidationErrors() {
    var error = false;
    Object.keys(this.EditProfileForm.controls).forEach((key) => {
      const controlErrors: ValidationErrors = this.EditProfileForm.get(key)
        .errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach((keyError) => {
          error = true;
        });
      }
    });
    return error;
  }
}
