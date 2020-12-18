import { Injectable, Inject } from '@angular/core';

import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

import { AuthService } from '@app/services/auth.service';
import { SnackbarSuccessComponent } from '@app/components/snackbar-success/snackbar-success.component';
import { SnackbarErrorComponent } from '@app/components/snackbar-error/snackbar-error.component';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  constructor(private _snackBar: MatSnackBar, private AuthService: AuthService) {}

  DialogList = {
    login: {
      success: 'Welcome to Kampong',
      error: 'Login failed, please try again',
    },
    register: {
      success: 'Please verify your email',
      error: 'Register failed, please try again',
    },
    upload_comments: {
      success: 'Comment posted successfully',
      error: 'Comment failed to post',
    },
    delete_comments: {
      success: 'Comment deleted',
      error: 'Failed to delete Comment',
    },
    upload_updates: {
      success: 'Update posted successfully',
      error: 'Update failed to post',
    },
    delete_updates: {
      success: 'Update deleted',
      error: 'Failed to delete Update',
    },
    liked_listing: {
      liked: 'Added to your Liked Initative',
      unliked: 'Removed from your Liked Initative',
      error: 'Error, please try again later',
    },
    create_organisation: {
      success: 'Organisation Successfully Created',
      error: 'Error, please try again later',
    },
    create_programme: {
      success: 'Programme Successfully Created',
      error: 'Error in creating programme',
    },
    create_listing: {
      success: 'Initiative Successfully Created',
      error: 'Error, please try again later',
    },
    update_listing: {
      success: 'Initiative Successfully Updated',
      error: 'Error, please try again later',
    },
    delete_listing: {
      success: 'Initiative Successfully Deleted',
      error: 'Error, please try again later',
    },
    update_profile: {
      success: 'Profile Successfully Updated',
      error: 'Error, please try again later',
    },
    setup_profile: {
      success: 'Profile Setup Complete ',
      error: 'Error, please try again later',
      validation_error: 'Please complete the setup',
    },
    send_message: {
      success: 'Your message has been sent!',
      error: 'Failed to send message',
    },
    send_application: {
      success: 'Your job application has been sent!',
      error: 'There is something wrong. Please try again later! ',
    },
    verify: {
      msg: 'PLease verify your email',
    },
  };

  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  openSnackBar(message: String, success: boolean) {
    this.AuthService.Dialogmessage = message;
    if (success) {
      this._snackBar.openFromComponent(SnackbarSuccessComponent, {
        duration: 5000,
        panelClass: 'success-dialog',
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    } else {
      this._snackBar.openFromComponent(SnackbarErrorComponent, {
        duration: 5000,
        panelClass: 'error-dialog',
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
  }
}
