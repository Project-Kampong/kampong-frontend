import { Component, Inject } from "@angular/core";
import { AuthService } from "@app/services/auth.service";

import {
  MatSnackBarConfig,
  MAT_SNACK_BAR_DATA,
  MatSnackBarRef,
} from "@angular/material";

@Component({
  selector: "app-snackbar-error",
  templateUrl: "./snackbar-error.component.html",
  styleUrls: ["./snackbar-error.component.scss"],
})
export class SnackbarErrorComponent {
  constructor(
    public AuthService: AuthService,
    public snackBarRef: MatSnackBarRef<SnackbarErrorComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: any
  ) {}
}
