import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";

// Services
import { AuthService } from "../services/auth.service";
import { ProfileService } from "../services/profile.service";
// Interface
import { Profile, DefaultProfile } from "../interfaces/profile";

@Component({
  selector: "app-edit-profile",
  templateUrl: "./edit-profile.component.html",
  styleUrls: ["./edit-profile.component.scss"],
})
export class EditProfileComponent implements OnInit {
  EditProfileForm: FormGroup;
  ProfileDetails: Profile[];
  constructor(
    private fb: FormBuilder,
    public AuthService: AuthService,
    public ProfileService: ProfileService,
    private router: Router
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
        this.router.navigate(["/profile"]);
      },
      (err) => {
        console.log("error");
      }
    );
  }
}
