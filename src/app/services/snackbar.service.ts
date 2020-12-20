import { Injectable } from "@angular/core";

import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from "@angular/material/snack-bar";

import { SnackbarSuccessComponent } from "@app/components/snackbar-success/snackbar-success.component";
import { SnackbarErrorComponent } from "@app/components/snackbar-error/snackbar-error.component";

@Injectable({
  providedIn: "root",
})
export class SnackbarService {

  constructor(private _snackBar: MatSnackBar) {}

  DialogList = {
    login: {
      success: "Welcome to Kampong",
      error: "Login failed, please try again",
    },
    register: {
      success: "Please verify your email",
      error: "Register failed, please try again",
    },
    upload_comments: {
      success: "Comment posted successfully",
      error: "Comment failed to post",
    },
    delete_comments: {
      success: "Comment deleted",
      error: "Failed to delete Comment",
    },
    upload_updates: {
      success: "Update posted successfully",
      error: "Update failed to post",
    },
    delete_updates: {
      success: "Update deleted",
      error: "Failed to delete Update",
    },
    like_listing: {
      liked: "Added to your Likes",
      unliked: "Removed from your Likes",
      error: "Error, please try again later",
      unauthorized: "Please login to like",
    },
    create_organisation : { 
      success: "Organisation Successfully Created",
      error: "Error, please try again later",
    },
    create_programme : {
      success: "Programme Successfully Created",
      error: "Error in creating programme"
    },
    create_listing: {
      success: "Initiative Successfully Created",
      error: "Error, please try again later",
    },
    update_listing: {
      success: "Initiative Successfully Updated",
      error: "Error, please try again later",
    },
    delete_listing: {
      success: "Initiative Successfully Deleted",
      error: "Error, please try again later",
    },
    update_profile: {
      success: "Profile Successfully Updated",
      error: "Error, please try again later",
    },
    setup_profile: {
      success: "Profile Setup Complete ",
      error: "Error, please try again later",
      validation_error: "Please complete the setup",
    },
    send_message: {
      success: "Your message has been sent!",
      error: "Failed to send message",
    },
    verify: {
      msg: "PLease verify your email",
    },
    generic_error: {
      error: "Error, please try again later",
    }
  };

  horizontalPosition: MatSnackBarHorizontalPosition = "right";
  verticalPosition: MatSnackBarVerticalPosition = "top";

  openSnackBar(message: string, success: boolean) {
    if (success) {
      this._snackBar.openFromComponent(SnackbarSuccessComponent, {
        data: message,
        duration: 5000,
        panelClass: "success-dialog",
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    } else {
      this._snackBar.openFromComponent(SnackbarErrorComponent, {
        data: message,
        duration: 5000,
        panelClass: "error-dialog",
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
  }
}
