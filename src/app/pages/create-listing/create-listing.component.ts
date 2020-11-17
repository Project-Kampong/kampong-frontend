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
  jobArr: Array<CreateListingJobs>
  faqArr: Array<CreateListingFAQ>;

  constructor(
    private fb: FormBuilder,
    public listingsService: ListingsService,
    private router: Router,
    public snackbarService: SnackbarService,
  ) {
    
    this.listingImages = [];
    this.listingImagesDisplay = [];
    this.hashtags = [];
    this.milestoneArr = [{ description: "", date: new Date() }];
    this.jobArr = [];
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
    });

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

  addHashtag(event: MatChipInputEvent): void {
    const value = ("#" + event.value.replace(/[&\/\\#,+()$~%. '":*?<>\[\]{}]/g, "")).trim();
    if (this.hashtags.length === 3 || value === "#" || event.value.length < 3) {
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
    this.jobArr.push({ title: "", description: "" });
  }

  removeDescription(i: number): void {
    this.jobArr.splice(i, 1);
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

  async createListing(): Promise<void> {
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
    const pics: string[] = [null, null, null, null, null];

    this.listingData = {
      title,
      category,
      tagline,
      mission,
      listing_url,
      listing_email,
      listing_status,
      pics,
      locations
    };

    (await this.listingsService.createListing(this.listingData, this.listingImages)).subscribe(
      (res) => {
        this.listingId = res["data"][0]["listing_id"];
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
          if (val.description != "" || val.date != null) {
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
          this.listingsService.createListingHashtags({
            listing_id: this.listingId,
            tag: val,
          }).subscribe(
            (res) => {},
            (err) => {
              console.log(err);
            }
          );
        })

        this.jobArr.forEach((val, idx) => {
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
            this.listingsService.createListingFAQ({
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

        this.listingData.locations.forEach((val, idx) => {
          this.listingsService.createListingLocation({
            listing_id: this.listingId,
            location_id: 1,
          }).subscribe(
            (res) => {},
            (err) => {
              console.log(err);
            }
          );
        })

      },
      
      (err) => {
        console.log(err);
        this.snackbarService.openSnackBar(
          this.snackbarService.DialogList.create_listing.error,
          false
        );
        this.listingForm.reset();
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
