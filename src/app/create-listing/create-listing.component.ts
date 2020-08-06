import { Component, OnInit } from "@angular/core";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatChipInputEvent } from "@angular/material/chips";

import { ListingsService } from "../services/listings.service";
declare var $: any;

// Interface
import { Listing, CreateListing, ListingStory } from "../interfaces/listing";

@Component({
  selector: "app-create-listing",
  templateUrl: "./create-listing.component.html",
  styleUrls: ["./create-listing.component.scss"],
})
export class CreateListingComponent implements OnInit {
  selectedFile: File = null;
  ListingForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public ListingsService: ListingsService
  ) {}

  fileDisplayArr = [];
  fileArr = [];
  fileLimit = false;
  fileCount = 0;

  milestoneArr = [{ milestone: "title", deadline: new Date("11/11/2020") }];
  ngOnInit() {
    this.ListingForm = this.fb.group({
      ...CreateListing,
      ...ListingStory,
    });
  }

  addMilestone() {
    this.milestoneArr.push({ milestone: "", deadline: new Date() });
    console.log(this.milestoneArr);
  }
  removeMilestone(i) {
    this.milestoneArr.splice(i, 1);
  }

  uploadFile(event) {
    this.selectedFile = <File>event.target.files[0];
    // this.fileArr.push(this.selectedFile);

    // Upload to S3
    const fd = new FormData();
    fd.append("file", this.selectedFile);
    this.ListingsService.uploadFile(fd).subscribe(
      (res) => {
        // Display Image
        var reader: FileReader = new FileReader();
        reader.onload = (e) => {
          this.fileDisplayArr.push(reader.result.toString());
        };
        reader.readAsDataURL(event.target.files[0]);
        this.fileLimitChecker(true);
        this.fileArr.push(res["data"].location);
      },
      (err) => {
        console.log(err);
        return;
      }
    );
  }

  removeFile(i) {
    this.fileDisplayArr.splice(i, 1);
    this.fileArr.splice(i, 1);
    this.fileLimitChecker(false);
  }

  fileLimitChecker(increase) {
    const maxFile = 5;
    if (increase) {
      this.fileCount = this.fileCount + 1;
      if (this.fileCount == maxFile) {
        this.fileLimit = true;
      }
    } else {
      this.fileCount = this.fileCount - 1;
      if (this.fileCount != maxFile) {
        this.fileLimit = false;
      }
    }
  }

  createListing() {
    console.log(this.fileArr);
    // Gather Files
    // const fd = new FormData();
    // for (let i = 0; i < this.fileArr.length; i++) {
    //   fd.append("file", this.fileArr[i]);
    // }
    // fd.append("file", this.selectedFile);
    // To be Replaced
    // this.ListingsService.uploadFile(fd).subscribe((data) => {
    //   console.log(data);
    // });
    // Image Loop
    var uploadImage = this.fileArr;
    var fileLength = uploadImage.length;
    if (fileLength != 5) {
      const nullToAdd = 5 - fileLength;
      console.log(nullToAdd);
      for (var i = 0; i < nullToAdd; i++) {
        uploadImage.push(null);
      }
    }
    console.log(this.ListingForm.value);
    const listingData = this.ListingForm.value;
    this.ListingsService.createListing({
      title: listingData.title,
      category: listingData.category,
      about: listingData.about,
      tagline: listingData.tagline,
      mission: listingData.mission,
      listing_url: "www.test.com",
      pic1: this.fileArr[0],
      pic2: this.fileArr[1],
      pic3: this.fileArr[2],
      pic4: this.fileArr[3],
      pic5: this.fileArr[4],
    }).subscribe(
      (res) => {
        console.log(res);
        // Handle Stories
        // Handle Milestones
        // Handle Hashtags
      },
      (err) => {
        console.log(err);
        return;
      }
    );
  }

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
