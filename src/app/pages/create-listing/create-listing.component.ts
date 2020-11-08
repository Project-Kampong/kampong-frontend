import { Component, OnInit } from "@angular/core";
import { COMMA, ENTER, SPACE } from "@angular/cdk/keycodes";
import {
  FormGroup,
  FormBuilder,
  Validators,
  ValidationErrors,
} from "@angular/forms";
import { MatChipInputEvent } from "@angular/material/chips";

import { Router } from "@angular/router";

import { ListingsService } from "@app/services/listings.service";
import { SnackbarService } from "@app/services/snackbar.service";
import { AuthService } from "@app/services/auth.service";

declare var $: any;

// Interface
import { Listing, CreateListing, ListingStory } from "@app/interfaces/listing";
import { CategoryFilter, LocationFilter } from '@app/interfaces/filters';

// Util
import { locationList } from '@app/util/locations';
import { categoryListCustom } from "@app/util/categories";

@Component({
  selector: "app-create-listing",
  templateUrl: "./create-listing.component.html",
  styleUrls: ["./create-listing.component.scss"],
})
export class CreateListingComponent implements OnInit {
  
  selectedFile: File = null;
  ListingForm: FormGroup;
  fileDisplayArr = [];
  fileArr = [];
  fileLimit = false;
  fileCount = 0;
  categoryGroup: Array<CategoryFilter>;
  locationGroup: Array<LocationFilter>;

  milestoneArr = [{ description: "", date: new Date() }];
  faqArr = [
    {
      questions: "",
      answer: "",
    },
  ];
  
  skillsets = [
    {
      name: "Big Data Analysis",
      group: [],
    },
    {
      name: "Coding and Programming",
      group: [],
    },
    {
      name: "Project Management",
      group: [],
    },
    {
      name: "Social Media Experience",
      group: [],
    },
    {
      name: "Writing",
      group: [],
    },
  ];

  locationList = [];

  rawSkillsets = [];

  constructor(
    private fb: FormBuilder,
    public ListingsService: ListingsService,
    private router: Router,
    public SnackbarService: SnackbarService,
  ) {}

  ngOnInit() {

    this.categoryGroup = categoryListCustom;
    this.locationGroup = locationList;

    this.ListingForm = this.fb.group({
      ...CreateListing,
      ...ListingStory,
      SkillsList: [],
      LocationsList: [],
      customCategory: ["", [Validators.maxLength(25)]],
    });
    this.paginationSkillsets();
    this.ListingsService.getAllLocations().subscribe((data) => {
      console.log(data);
      this.locationList = data["data"];
    });

    // CMS
    $(".action-container .action-btn").on("click", function () {
      let cmd = $(this).data("command");
      console.log(cmd);
      if (cmd == "createlink") {
        let url = prompt("Enter the link here: ", "https://");
        document.execCommand(cmd, false, url);
      } else if (cmd == "formatBlock") {
        let size = $(this).data("size");
        document.execCommand(cmd, false, size);
      } else {
        document.execCommand(cmd, false, null);
      }
    });
    console.log(this.ListingForm);
  }

  // generateHTML() {
  //   document.getElementById("result").textContent = this.output.innerHTML;
  // }

  // Get Skillsets
  paginationSkillsets() {
    this.ListingsService.getAllSkillsets().subscribe((data) => {
      this.rawSkillsets.push(...data["data"]);
      // Sort Skills
      for (var i = 0; i < this.skillsets.length; i++) {
        this.rawSkillsets.map((x) => {
          if (x.skill_group == this.skillsets[i].name) {
            this.skillsets[i].group.push(x);
          }
        });
      }
    });
  }

  uploadFile(event) {
    this.selectedFile = <File>event.target.files[0];
    // Display Image
    var reader: FileReader = new FileReader();
    reader.onload = (e) => {
      this.fileDisplayArr.push(reader.result.toString());
    };
    reader.readAsDataURL(event.target.files[0]);
    this.fileLimitChecker(true);
    this.fileArr.push(this.selectedFile);
    console.log(this.fileArr);
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

  getFormValidationErrors() {
    var error = false;
    Object.keys(this.ListingForm.controls).forEach((key) => {
      const controlErrors: ValidationErrors = this.ListingForm.get(key).errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach((keyError) => {
          error = true;
        });
      }
    });
    if (this.fileCount == 0) {
      error = true;
    }
    if (
      this.ListingForm.value.category == "Create a Category" &&
      this.ListingForm.value.customCategory == ""
    ) {
      error = true;
    }
    return error;
  }

  createListing() {
    if (this.getFormValidationErrors() == true) {
      this.SnackbarService.openSnackBar("Please complete the form", false);
      return;
    }
    var routeTo;
    const listingData = this.ListingForm.value;
    var ImageFd = new FormData();
    ImageFd.append("title", listingData.title);

    if (listingData.category == "Create a Category") {
      ImageFd.append("category", listingData.customCategory);
    } else {
      ImageFd.append("category", listingData.category);
    }
    ImageFd.append("tagline", listingData.tagline);
    ImageFd.append("mission", listingData.mission);
    ImageFd.append("listing_url", "www.test.com");
    ImageFd.append("listing_email", listingData.listing_email);
    ImageFd.append("listing_status", "ongoing");
    for (var i = 0; i < this.fileArr.length; i++) {
      ImageFd.append("pic" + (i + 1), this.fileArr[i].name);
      ImageFd.append("pics", this.fileArr[i]);
    }
    this.ListingsService.createListing(ImageFd).subscribe(
      (res) => {
        console.log(res);
        const listing_id = res["data"][0]["listing_id"];
        routeTo = listing_id;
        console.log(listing_id);
        // Handle Stories
        this.ListingsService.UpdateListingStory(listing_id, {
          overview: $("#output").html(),
          problem: "test",
          solution: "test",
          outcome: "test",
        }).subscribe((data) => {
          console.log(data);
        });
        // Handle Milestones
        for (var i = 0; i < this.milestoneArr.length; i++) {
          if (
            this.milestoneArr[i].description != "" &&
            this.milestoneArr[i].date != null
          ) {
            this.ListingsService.createListingMilestones({
              listing_id: listing_id,
              description: this.milestoneArr[i].description,
              date: this.milestoneArr[i].date,
            }).subscribe((data) => {
              console.log(data);
            });
          }
        }
        // Handle Hashtags
        if (this.hashtags.length >= 1) {
          for (var i = 0; i < this.hashtags.length; i++) {
            this.ListingsService.createListingHashtags({
              listing_id: listing_id,
              tag: this.hashtags[i],
            }).subscribe((data) => {
              console.log(data);
            });
          }
        }
        // Handle Skills/ Jobs
        for (var i = 0; i < this.lookingForArr.length; i++) {
          if (
            this.lookingForArr[i]["skill_id"] != "" &&
            this.lookingForArr[i]["description"] != ""
          ) {
            this.ListingsService.createListingJobs({
              listing_id: listing_id,
              job_title: this.lookingForArr[i].skills,
              job_description: this.lookingForArr[i].description,
            }).subscribe((data) => {});
          }
        }

        // Handle FAQs
        for (var i = 0; i < this.faqArr.length; i++) {
          if (this.faqArr[i].questions != "" && this.faqArr[i].answer != "") {
            this.ListingsService.createListingFAQ({
              listing_id: listing_id,
              question: this.faqArr[i].questions,
              answer: this.faqArr[i].answer,
            }).subscribe((data) => {
              console.log(data);
            });
          }
        }

        // Handle Location
        if (listingData.LocationsList != null) {
          for (var i = 0; i < listingData.LocationsList.length; i++) {
            this.ListingsService.createListingLocation({
              listing_id: listing_id,
              location_id: listingData.LocationsList[i],
            }).subscribe();
          }
        }
      },
      (err) => {
        console.log(err);
        this.SnackbarService.openSnackBar(
          this.SnackbarService.DialogList.create_listing.error,
          false
        );
        this.router.navigate(["/home"]);
      },
      () => {
        this.SnackbarService.openSnackBar(
          this.SnackbarService.DialogList.create_listing.success,
          true
        );
        this.router.navigate(["/listing/" + routeTo]);
      }
    );
  }

  // Chips UI and Data
  visible = true;
  selectable = false;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA, SPACE];
  hashtags = [];
  hashtagsError = false;
  add(event: MatChipInputEvent): void {
    const value =
      "#" + event.value.replace(/[&\/\\#,+()$~%. '":*?<>\[\]{}]/g, "");
    if (this.hashtags.length == 3) {
      this.hashtagsError = true;
    } else if (value != "#") {
      this.hashtagsError = false;
      const input = event.input;
      console.log(value);
      if ((value || "").trim()) {
        this.hashtags.push(value.trim());
      }
      if (input) {
        input.value = "";
      }
    }
  }

  remove(data): void {
    const index = this.hashtags.indexOf(data);
    if (index >= 0) {
      this.hashtags.splice(index, 1);

      if (this.hashtags.length == 3) {
        this.hashtagsError = true;
      } else {
        this.hashtagsError = false;
      }
    }
  }

  // Milestones and FAQ UI
  addMilestone() {
    this.milestoneArr.push({ description: "", date: new Date() });
    console.log(this.milestoneArr);
    this.milestoneArr.sort((a, b) => {
      return <any>new Date(a.date) - <any>new Date(b.date);
    });
  }
  sortMilestone() {
    this.milestoneArr = this.milestoneArr.sort((a, b) => {
      return <any>new Date(a.date) - <any>new Date(b.date);
    });
  }
  removeMilestone(i) {
    console.log(i);
    this.milestoneArr.splice(i, 1);
  }

  addFAQ() {
    this.faqArr.push({
      questions: "",
      answer: "",
    });
  }
  removeFAQ(i) {
    this.faqArr.splice(i, 1);
  }

  // Looking for
  lookingForArr = [{ skills: "", description: "" }];
  addDescription() {
    this.lookingForArr.push({ skills: "", description: "" });
    console.log(this.lookingForArr);
  }
  removeDescription(index) {
    this.lookingForArr.splice(index, 1);
    if (this.lookingForArr.length == 0) {
      this.lookingForArr.push({ skills: "", description: "" });
    }
  }
}
