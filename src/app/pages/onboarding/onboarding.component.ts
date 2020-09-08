import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  ValidationErrors,
} from "@angular/forms";
import { Router } from "@angular/router";

declare var $: any;

// Services
import { AuthService } from "@app/services/auth.service";
import { ProfileService } from "@app/services/profile.service";
import { SnackbarService } from "@app/services/snackbar.service";
// Interface
import { Profile, DefaultProfile } from "@app/interfaces/profile";

@Component({
  selector: "app-onboarding",
  templateUrl: "./onboarding.component.html",
  styleUrls: ["./onboarding.component.scss"],
})
export class OnboardingComponent implements OnInit {
  EditProfileForm: FormGroup;
  ProfileDetails: Profile = <Profile>{};

  constructor(
    private fb: FormBuilder,
    public AuthService: AuthService,
    public ProfileService: ProfileService,
    private router: Router,
    public SnackbarService: SnackbarService
  ) {}

  ngOnInit() {
    this.EditProfileForm = this.fb.group({
      ...DefaultProfile,
    });
    if (this.AuthService.isLoggedIn) {
      this.getInitData();
    }
    this.AuthService.LoginResponse.subscribe(() => {
      this.getInitData();
    });
  }

  getInitData() {
    this.ProfileService.getUserProfile(
      this.AuthService.LoggedInUserID
    ).subscribe((data) => {
      this.ProfileDetails = data["data"];
      this.EditProfileForm.patchValue(this.ProfileDetails);
    });
  }

  saveProfile() {
    if (this.getFormValidationErrors()) {
      this.SnackbarService.openSnackBar(
        this.SnackbarService.DialogList.setup_profile.validation_error,
        false
      );
      return;
    }
    this.ProfileService.updateUserProfile(
      this.ProfileDetails["user_id"],
      this.EditProfileForm.value
    ).subscribe(
      (res) => {
        if (this.selectedFile != null) {
          var ImageFd = new FormData();
          ImageFd.append("pic", this.selectedFile);
          this.ProfileService.updateUserProfilePic(
            this.ProfileDetails["user_id"],
            ImageFd
          ).subscribe(
            (res) => {
              this.AuthService.LoginResponse.emit();
              this.router.navigate(["/profile"]);
            },
            (err) => {
              console.log("error");
            }
          );
        } else {
          this.AuthService.LoginResponse.emit();
          this.SnackbarService.openSnackBar(
            this.SnackbarService.DialogList.setup_profile.success,
            true
          );
          this.router.navigate(["/profile"]);
        }
      },
      (err) => {
        console.log("error");
        this.SnackbarService.openSnackBar(
          this.SnackbarService.DialogList.setup_profile.error,
          false
        );
        this.router.navigate(["/profile"]);
      }
    );
  }

  selectedFile;
  uploadFile(event) {
    this.selectedFile = <File>event.target.files[0];
    // Display Image
    var reader: FileReader = new FileReader();
    reader.onload = (e) => {
      // this.fileDisplayArr.push(reader.result.toString());
      this.ProfileDetails.profile_picture = reader.result.toString();
    };
    reader.readAsDataURL(event.target.files[0]);
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
