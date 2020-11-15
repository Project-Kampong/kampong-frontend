// Angular Imports
import { Component, OnInit } from "@angular/core";
import { COMMA, ENTER, SPACE } from "@angular/cdk/keycodes";
import { FormGroup, FormBuilder, ValidationErrors } from "@angular/forms";
import { MatChipInputEvent } from "@angular/material/chips";
import { Router } from "@angular/router";

// Services
import { ListingsService } from "@app/services/listings.service";
import { SnackbarService } from "@app/services/snackbar.service";

// Util
import { locationList } from '@app/util/locations';
import { categoryList } from "@app/util/categories";

// Interfaces
import { CreateListingForm, CreateListingStoryForm, CreateListingFAQ, 
  CreateListingJobs, CreateListingMilestones, CreateListing } from "@app/interfaces/listing";
import { CategoryFilter, LocationFilter } from '@app/interfaces/filters';

declare var $: any;

@Component({
  selector: "app-create-listing",
  templateUrl: "./create-listing.component.html",
  styleUrls: ["./create-listing.component.scss"],
})
export class CreateListingComponent implements OnInit {
  
  readonly separatorKeysCodes: number[] = [ENTER, COMMA, SPACE];
  listingForm: FormGroup;
  listingData: CreateListing;
  listingId: string;
  removable: boolean;
  categoryGroup: Array<CategoryFilter>;
  locationGroup: Array<LocationFilter>;
  listingImages: File[];
  listingImagesDisplay: string[];
  hashtags: string[];
  milestoneArr: Array<CreateListingMilestones>;
  lookingForArr: Array<CreateListingJobs>
  faqArr: Array<CreateListingFAQ>;
  rawSkillsets: any[]; // to delete

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

  constructor(
    private fb: FormBuilder,
    public listingsService: ListingsService,
    private router: Router,
    public snackbarService: SnackbarService,
  ) {
    
    this.rawSkillsets = [];
    this.listingImages = [];
    this.listingImagesDisplay = [];
    this.hashtags = [];
    this.milestoneArr = [{ description: "", date: new Date() }];
    this.lookingForArr = [];
    this.faqArr = [];
    this.listingId = "";
    this.removable = true;
  }
  
  ngOnInit() {

    this.categoryGroup = categoryList;
    this.locationGroup = locationList;

    this.listingForm = this.fb.group({
      ...CreateListingForm,
      ...CreateListingStoryForm,
      LocationsList: [],
      //customCategory: ["", [Validators.maxLength(25)]],
    });

    this.paginationSkillsets(); // to be replaced

    // CMS
    $(".action-container .action-btn").on("click", function () {
      const cmd = $(this).data("command");
      if (cmd == "createlink") {
        const url = prompt("Enter the link here: ", "https://");
        document.execCommand(cmd, false, url);
      } else if (cmd == "formatBlock") {
        const size = $(this).data("size");
        document.execCommand(cmd, false, size);
      } else {
        document.execCommand(cmd, false, null);
      }
    });
  }

  // to delete
  paginationSkillsets(): void {
    this.listingsService.getAllSkillsets().subscribe((data) => {
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

  addHashtag(event: MatChipInputEvent): void {
    const value = ("#" + event.value.replace(/[&\/\\#,+()$~%. '":*?<>\[\]{}]/g, "")).trim();
    if (this.hashtags.length === 3 || value === "#") {
      return;
    }
    this.hashtags.push(value);
    event.input.value = "";
  }

  removeHashtag(tag: string): void {
    this.hashtags.splice(this.hashtags.indexOf(tag), 1);
  }

  uploadImage(event: Event): void {
    if (this.listingImagesDisplay.length === 5 && this.listingImages.length === 5 ) {
      return;
    }
    const reader: FileReader = new FileReader();
    reader.onload = (e) => {
      this.listingImagesDisplay.push(reader.result.toString());
    }
    try {
      reader.readAsDataURL((event.target as HTMLInputElement).files[0]);
    } catch (error) {
      console.log(error);
      return;
    }
    this.listingImages.push(<File>(event.target as HTMLInputElement).files[0]);
  }

  removeImage(i: number): void {
    this.listingImagesDisplay.splice(i, 1);
    this.listingImages.splice(i, 1);
  }

  addMilestone(): void {
    this.milestoneArr.push({ description: "", date: new Date() });
    this.milestoneArr.sort((a, b) => {
      const result: number = (new Date(a.date)).valueOf() - (new Date(b.date)).valueOf();
      return result;
    });
  }

  sortMilestone(): void {
    this.milestoneArr = this.milestoneArr.sort((a, b) => {
      const result: number = (new Date(a.date)).valueOf() - (new Date(b.date)).valueOf();
      return result;
    });
  }

  removeMilestone(i: number): void {
    this.milestoneArr.splice(i, 1);
  }

  addFAQ(): void {
    this.faqArr.push({
      question: "",
      answer: "",
    });
  }
  removeFAQ(i: number): void {
    this.faqArr.splice(i, 1);
  }

  addDescription(): void {
    this.lookingForArr.push({ title: "", description: "" });
  }

  removeDescription(i: number): void {
    this.lookingForArr.splice(i, 1);
  }

  getFormValidationErrors(): boolean {
    Object.keys(this.listingForm.controls).forEach((key) => {
      const controlErrors: ValidationErrors = this.listingForm.get(key).errors;
      if (controlErrors != null) {
        return true;
      }
    });
    return false;
  }

  createListing(): void {
    if (this.getFormValidationErrors() === true) {
      this.snackbarService.openSnackBar("Please complete the form", false);
      return;
    }

    const title: string = this.listingForm.value.title;
    const category: string = this.listingForm.value.category;
    const tagline: string = this.listingForm.value.tagline;
    const mission: string = this.listingForm.value.mission;
    const listing_url: string = this.listingForm.value.listing_url;
    const listing_email: string = this.listingForm.value.listing_email;
    const listing_status: string = "ongoing";
    const locations: string[] = this.listingForm.value.locations;

    // To replace with 2 step FE approach
    const pic1: string = this.listingImages[0] ? this.listingImages[0].name: null;
    const pic2: string = this.listingImages[1] ? this.listingImages[1].name: null;
    const pic3: string = this.listingImages[2] ? this.listingImages[2].name: null;
    const pic4: string = this.listingImages[3] ? this.listingImages[3].name: null;
    const pic5: string = this.listingImages[4] ? this.listingImages[4].name: null;

    this.listingData = {
      title,
      category,
      tagline,
      mission,
      listing_url,
      listing_email,
      listing_status,
      pic1,
      pic2,
      pic3,
      pic4,
      pic5,
      locations
    };

    this.listingsService.createListing(this.listingData).subscribe(
      (res) => {
        this.listingId = res["data"][0]["listing_id"];

        // Handle Stories (To change)
        this.listingsService.UpdateListingStory(this.listingId, {
          overview: $("#overview").html(),
          problem: $("#problem").html(),
          solution: $("#solution").html(),
          outcome: $("#outcome").html(),
        }).subscribe(
          (res) => {},
          (err) => {
            console.log(err);
          }
        );

        this.milestoneArr.forEach((val, idx) => {
          if (val.description != "" && val.date != null) {
            this.listingsService.createListingMilestones({
              listing_id: this.listingId,
              description: val.description,
              date: val.date,
            }).subscribe(
              (res) => {},
              (err) => {
                console.log(err);
              }
            );
          }
        })

        this.hashtags.forEach((val, idx) => {
          this.listingsService.createListingMilestones({
            listing_id: this.listingId,
            tag: val,
          }).subscribe(
            (res) => {},
            (err) => {
              console.log(err);
            }
          );
        })

        this.lookingForArr.forEach((val, idx) => {
          if (val.title != "" && val.description != "") {
            this.listingsService.createListingJobs({
              listing_id: this.listingId,
              job_title: val.title,
              job_description: val.description,
            }).subscribe(
              (res) => {},
              (err) => {
                console.log(err);
              }
            )
          }
        });

        this.faqArr.forEach((val, idx) => {
          if (val.question != "" && val.answer != "") {
            this.listingsService.createListingJobs({
              listing_id: this.listingId,
              question: val.question,
              answer: val.answer,
            }).subscribe(
              (res) => {},
              (err) => {
                console.log(err);
              }
            )
          }
        });

        // Handle Location (placeholder)
        if (this.listingData.locations != null) {
          for (var i = 0; i < this.listingData.locations.length; i++) {
            this.listingsService.createListingLocation({
              listing_id: this.listingId,
              location_id: 1,
            }).subscribe();
          }
        }
      },
      
      (err) => {
        console.log(err);
        this.snackbarService.openSnackBar(
          this.snackbarService.DialogList.create_listing.error,
          false
        );
        this.router.navigate(["/home"]);
      },
      () => {
        this.snackbarService.openSnackBar(
          this.snackbarService.DialogList.create_listing.success,
          true
        );
        this.router.navigate(["/listing/" + this.listingId]);
      }
    );
  }

}
