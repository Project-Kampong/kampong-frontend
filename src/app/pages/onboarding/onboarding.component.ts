import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DialogComponent } from '@app/components/dialog/dialog.component';
import { FormGroup, FormBuilder, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';

// Services
import { AuthService } from '@app/services/auth.service';
import { ProfileService } from '@app/services/profile.service';
import { SnackbarService } from '@app/services/snackbar.service';
// Interface
import { Profile } from '@app/interfaces/profile';
import { profileForm } from '@app/util/forms/profile';
import { UserData } from '@app/interfaces/user';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss'],
})
export class OnboardingComponent implements OnInit, OnDestroy {
  private userData: UserData = <UserData>{};
  editProfileForm: FormGroup;
  profileData: Profile = <Profile>{};
  isLoggedIn: boolean = false;
  subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private dialog: MatDialog,
    private profileService: ProfileService,
    private router: Router,
    private snackbarService: SnackbarService,
  ) {}

  ngOnInit() {
    this.openEmailVerification();
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
            this.router.navigate(['/login']);
          },
        ),
      );
    }
  }

  saveProfile() {
    if (this.getFormValidationErrors()) {
      this.snackbarService.openSnackBar(this.snackbarService.DialogList.setup_profile.validation_error, false);
      return;
    }
    this.profileService.updateUserProfile(this.profileData['user_id'], this.editProfileForm.value).subscribe(
      (res) => {
        if (true) {
          let ImageFd = new FormData();
          this.profileService.updateUserProfilePic(this.profileData['user_id'], ImageFd).subscribe(
            (res) => {
              this.router.navigate(['/profile']);
            },
            (err) => {
              console.log(err);
            },
          );
        }
        //this.authService.LoginResponse.emit();
        this.snackbarService.openSnackBar(this.snackbarService.DialogList.setup_profile.success, true);
        this.router.navigate(['/profile']);
      },
      (err) => {
        console.log(err);
        this.snackbarService.openSnackBar(this.snackbarService.DialogList.setup_profile.error, false);
        this.router.navigate(['/profile']);
      },
    );
  }

  uploadFile(e: any): void {
    console.log('Upload file');
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

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  openEmailVerification(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: 'Verify Email',
        content: `An Email containing a verification link has been sent to your email. Please click on the link to activate your account.
        <p></p><p>You will <b>NOT</b> be able to use the functionalities of this application without verifying your account. </p>
        *this modal will not be closable till the verification link is clicked*
        <br /><p></p><a target="_blank" href="https://github.com/Project-Kampong/kampong-frontend">Resend activation email</a>`,
      },
    });
  }

  checkPageOneErrors(): boolean {
    if (this.editProfileForm.controls.nickname.errors != null) {
      return true;
    }
    if (this.editProfileForm.controls.dob.errors != null) {
      return true;
    }
    return false;
  }

  checkPageTwoErrors(): boolean {
    if (this.editProfileForm.controls.occupation.errors != null) {
      return true;
    }
    return false;
  }
}
