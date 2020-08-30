import { Component, Inject, Input } from "@angular/core";
import { AuthService } from "@app/services/auth.service";

import {
  MatSnackBarConfig,
  MAT_SNACK_BAR_DATA,
  MatSnackBarRef,
} from "@angular/material";

@Component({
  selector: "app-snackbar-success",
  templateUrl: "./snackbar-success.component.html",
  styleUrls: ["./snackbar-success.component.scss"],
})
export class SnackbarSuccessComponent {
  constructor(
    public AuthService: AuthService,
    public snackBarRef: MatSnackBarRef<SnackbarSuccessComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: any
  ) {}
}
