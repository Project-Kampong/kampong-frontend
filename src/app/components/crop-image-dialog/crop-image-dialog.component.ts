import { Component, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Inject } from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-dialog',
  templateUrl: './crop-image-dialog.component.html',
  styleUrls: ['./crop-image-dialog.component.scss'],
})
export class CropImageDialogComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) private data: any) {}

  ngOnInit() {}

  imageCropped(event: ImageCroppedEvent) {
    this.data.imageCropped = event.base64;
  }
  imageLoaded() {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }
}
