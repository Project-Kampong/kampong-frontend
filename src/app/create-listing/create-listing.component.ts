import { Component, OnInit } from "@angular/core";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatChipInputEvent } from "@angular/material/chips";

@Component({
  selector: "app-create-listing",
  templateUrl: "./create-listing.component.html",
  styleUrls: ["./create-listing.component.scss"],
})
export class CreateListingComponent implements OnInit {
  selectedFile: File = null;
  constructor(private fb: FormBuilder) {}

  ngOnInit() {}

  uploadFile(event) {
    this.selectedFile = <File>event.target.files[0];
    console.log(this.selectedFile);
  }

  createListing() {}

  // Chips UI and Data
  visible = true;
  selectable = false;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  hashtags = ["hashtag1", "hashtag2", "hashtag3"];

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if ((value || "").trim()) {
      this.hashtags.push(value.trim());
    }
    if (input) {
      input.value = "";
    }
  }

  remove(data): void {
    const index = this.hashtags.indexOf(data);
    if (index >= 0) {
      this.hashtags.splice(index, 1);
    }
  }
}
