import { Component, Inject } from "@angular/core";

import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from "@angular/material";

@Component({
  selector: "app-snackbar-success",
  templateUrl: "./snackbar-success.component.html",
  styleUrls: ["./snackbar-success.component.scss"],
})
export class SnackbarSuccessComponent {
  
  constructor(public snackBarRef: MatSnackBarRef<SnackbarSuccessComponent>, @Inject(MAT_SNACK_BAR_DATA) private data: string) {}
  
}
