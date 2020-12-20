import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, ValidationErrors } from "@angular/forms";
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
  selector: "app-edit-profile",
  templateUrl: "./edit-profile.component.html",
  styleUrls: ["./edit-profile.component.scss"],
})
export class EditProfileComponent implements OnInit, OnDestroy {
  
  private userData: UserData = <UserData>{};
  editProfileForm: FormGroup;
  private profileData: Profile = <Profile>{};
  private isLoggedIn: boolean;
  subscriptions: Subscription[] = [];

  constructor(private fb: FormBuilder, private authService: AuthService, private profileService: ProfileService) {}

  ngOnInit() {
    this.editProfileForm = this.fb.group({...profileForm});
    if (this.authService.checkCookie()) {
      this.subscriptions.push(this.authService.getUserDataByToken().subscribe(
        (res) => {
          this.userData = res["data"];
          this.subscriptions.push(this.profileService.getUserProfile(this.userData["user_id"]).subscribe(
            (res) => {
              this.profileData = res["data"];
              this.editProfileForm.patchValue(this.profileData);
              this.isLoggedIn = true;
            },
            (err) => {
              console.log(err);
            }
          ))
        },
        (err) => {
          console.log(err);
          console.log("User is not logged in");
        }
      ))
    }
  }

  saveProfile() {
    console.log("Save");
  }

  togglePopup() {
    $(".popup-bg").toggleClass("active");
    $(".popup-box").toggleClass("active");
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
