import { Component, Inject } from "@angular/core";
import { SnackbarService } from "@app/services/snackbar.service";

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
    public SnackbarService: SnackbarService,
    public snackBarRef: MatSnackBarRef<SnackbarErrorComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: any
  ) {}
}
