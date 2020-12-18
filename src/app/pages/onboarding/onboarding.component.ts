import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  ValidationErrors,
} from "@angular/forms";
import { Router } from "@angular/router";

declare var $: any;

// Services
import { AuthService } from "@app/services/auth.service";
import { ProfileService } from "@app/services/profile.service";
import { SnackbarService } from "@app/services/snackbar.service";
// Interface
import { Profile } from "@app/interfaces/profile";
import { profileForm } from "@app/util/forms/profile";
import { UserData } from "@app/interfaces/user";
import { Subscription } from "rxjs";

@Component({
  selector: "app-onboarding",
  templateUrl: "./onboarding.component.html",
  styleUrls: ["./onboarding.component.scss"],
})
export class OnboardingComponent implements OnInit, OnDestroy {
  
  private userData: UserData = <UserData>{};
  editProfileForm: FormGroup;
  profileData: Profile = <Profile>{};
  isLoggedIn: boolean;
  subscriptions: Subscription[] = [];

  constructor(private fb: FormBuilder, private authService: AuthService, private profileService: ProfileService, private router: Router, private snackbarService: SnackbarService) {}

  ngOnInit() {
    this.editProfileForm = this.fb.group({ ...profileForm });
    this.isLoggedIn = this.authService.getIsLoggedIn();
    if (this.isLoggedIn) {
      this.userData = this.authService.getUserDetails();
    }
    this.subscriptions.push(this.profileService.getUserProfile(this.userData["user_id"]).subscribe(
      (res) => {
        this.profileData = res["data"];
        this.editProfileForm.patchValue(this.profileData);
      },
      (err) => {
        console.log(err)
      }
    ));
  }

  saveProfile() {
    if (this.getFormValidationErrors()) {
      this.snackbarService.openSnackBar(
        this.snackbarService.DialogList.setup_profile.validation_error,
        false
      );
      return;
    }
    this.profileService.updateUserProfile(
      this.profileData["user_id"],
      this.editProfileForm.value,
      this.authService.getAuthOptions()
    ).subscribe(
      (res) => {
        if (true) {
          var ImageFd = new FormData();
          this.profileService.updateUserProfilePic(
            this.profileData["user_id"],
            ImageFd,
            this.authService.getAuthOptionsWithoutContentType()
          ).subscribe(
            (res) => {
              //this.authService.LoginResponse.emit();
              this.router.navigate(["/profile"]);
            },
            (err) => {
              console.log("error");
            }
          );
        } else {
          //this.authService.LoginResponse.emit();
          this.snackbarService.openSnackBar(
            this.snackbarService.DialogList.setup_profile.success,
            true
          );
          this.router.navigate(["/profile"]);
        }
      },
      (err) => {
        console.log("error");
        this.snackbarService.openSnackBar(
          this.snackbarService.DialogList.setup_profile.error,
          false
        );
        this.router.navigate(["/profile"]);
      }
    );
  }


  getFormValidationErrors() {
    var error = false;
    Object.keys(this.editProfileForm.controls).forEach((key) => {
      const controlErrors: ValidationErrors = this.editProfileForm.get(key)
        .errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach((keyError) => {
          error = true;
        });
      }
    });
    return error;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
