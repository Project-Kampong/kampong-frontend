import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, ValidationErrors } from '@angular/forms';

declare var $: any;

// Services
import { AuthService } from '@app/services/auth.service';
import { ProfileService } from '@app/services/profile.service';
// Interface
import { Profile } from '@app/interfaces/profile';
import { profileForm } from '@app/util/forms/profile';
import { UserData } from '@app/interfaces/user';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements OnInit, OnDestroy {
  private userData: UserData = <UserData>{};
  editProfileForm: FormGroup;
  profileData: Profile = <Profile>{};
  isLoggedIn: boolean;
  subscriptions: Subscription[] = [];

  oldpassword: string = '';
  newpassword: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private profileService: ProfileService) {}

  ngOnInit() {
    this.editProfileForm = this.fb.group({ ...profileForm });
    if (this.authService.checkCookie()) {
      this.subscriptions.push(
        this.authService.getUserDataByToken().subscribe(
          (res) => {
            this.userData = res['data'];
            this.subscriptions.push(
              this.profileService.getUserProfile(this.userData['user_id']).subscribe(
                (res) => {
                  this.profileData = res['data'];
                  this.editProfileForm.patchValue(this.profileData);
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
        ),
      );
    }
  }

  uploadFile(e: any): void {
    return null;
  }

  getFormValidationErrors(): boolean {
    Object.keys(this.editProfileForm.controls).forEach((key) => {
      const controlErrors: ValidationErrors = this.editProfileForm.get(key).errors;
      if (controlErrors != null) {
        return true;
      }
    });
    return false;
  }

  saveProfile() {
    console.log('Save');
  }

  togglePopup() {
    $('.popup-bg').toggleClass('active');
    $('.popup-box').toggleClass('active');
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
