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
  selector: "app-edit-profile",
  templateUrl: "./edit-profile.component.html",
  styleUrls: ["./edit-profile.component.scss"],
})
export class EditProfileComponent implements OnInit {
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
            this.SnackbarService.DialogList.update_profile.success,
            true
          );
          this.router.navigate(["/profile"]);
        }
      },
      (err) => {
        console.log("error");
        this.SnackbarService.openSnackBar(
          this.SnackbarService.DialogList.update_profile.error,
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

  oldpassword;
  newpassword;
  showErrorMsg = false;
  // Update Password
  updatePassword() {
    this.AuthService.updatePassword({
      oldPassword: this.oldpassword,
      newPassword: this.newpassword,
    }).subscribe(
      (data) => {
        console.log(data);
        this.oldpassword = new String();
        this.newpassword = new String();
        $(".popup-bg").removeClass("active");
        $(".popup-box").removeClass("active");
      },
      (err) => {
        this.showErrorMsg = true;
        console.log(err);
      }
    );
  }

  togglePopup() {
    // Toggle popup
    $(".popup-bg").toggleClass("active");
    $(".popup-box").toggleClass("active");
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
