// Angular Imports
import { Component, OnDestroy, OnInit } from "@angular/core";
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
import { CreateListingFAQ,  CreateListing } from "@app/interfaces/listing";
import { createListingForm } from "@app/util/forms/listing";
import { CategoryFilter, LocationFilter } from '@app/interfaces/filters';
import { catchError } from 'rxjs/operators';
import { forkJoin, Observable, of, Subscription } from 'rxjs';
import { AuthService } from "@app/services/auth.service";

declare var $: any;

interface AddListingMilestones {
  milestone_description: string;
  date: Date;
}
interface AddListingJobs {
  job_title: string;
  job_description: string;
}
interface AddListingFAQ {
  question: string;
  answer: string;
}

@Component({
  selector: "app-create-listing",
  templateUrl: "./create-listing.component.html",
  styleUrls: ["./create-listing.component.scss"],
})
export class CreateListingComponent implements OnInit, OnDestroy {
  
  readonly separatorKeysCodes: number[] = [ENTER, COMMA, SPACE];
  listingForm: FormGroup;
  listingData: CreateListing;
  listingId: string = "";
  removable: boolean = true;
  categoryGroup: CategoryFilter[] = [];
  locationGroup: LocationFilter[] = [];
  listingImages: File[] = [];
  listingImagesDisplay: string[] = [];
  hashtags: string[] = [];
  milestoneArr: AddListingMilestones[] = [{ milestone_description: "", date: new Date() }];
  jobArr: AddListingJobs[] = [];
  faqArr: AddListingFAQ[] = [];
  subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private listingsService: ListingsService,
    private router: Router,
    private snackbarService: SnackbarService,
    private authService: AuthService,

  ) {}
  
  ngOnInit() {

    this.categoryGroup = categoryList;
    this.locationGroup = locationList;
    this.listingForm = this.fb.group({
      ...createListingForm,
    });

    // CMS
    $(".action-container .action-btn").on("click", function() {
      const cmd = $(this).data("command");
      if (cmd == "createlink") {
        const url = prompt("Enter the link here: ");
        if (url === null) {
          return;
        }
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
    if (this.listingImagesDisplay.length === 5 && this.listingImages.length === 5) {
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
    this.milestoneArr.push({ milestone_description: "", date: new Date() });
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
    this.jobArr.push({ job_title: "", job_description: "" });
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

  createMilestones(): Observable<any[]> {
    const milestoneCreateObservables: Observable<any>[] = [];
    this.milestoneArr.forEach((val) => {
      if (val.milestone_description !== "" && val.date !== null) {
        milestoneCreateObservables.push(this.listingsService.createListingMilestones({
          listing_id: this.listingId,
          milestone_description: val.milestone_description,
          date: val.date,
        }).pipe(catchError(error => of(error))));
      }
    })
    return forkJoin(milestoneCreateObservables);
  }

  createHashtags(): Observable<any[]> {
    const hashtagsCreateObservables: Observable<any>[] = [];
    this.hashtags.forEach((val) => {
      hashtagsCreateObservables.push(this.listingsService.createListingHashtags({
        listing_id: this.listingId,
        tag: val,
      }).pipe(catchError(error => of(error))));
    })
    return forkJoin(hashtagsCreateObservables);
  }

  createJobs(): Observable<any[]> {
    const jobsCreateObservables: Observable<any>[] = [];
    this.jobArr.forEach((val) => {
      if (val.job_title !== "" && val.job_description !== "") {
        jobsCreateObservables.push(this.listingsService.createListingJobs({
          listing_id: this.listingId,
          job_title: val.job_title,
          job_description: val.job_description,
        }).pipe(catchError(error => of(error))));
      }
    })
    return forkJoin(jobsCreateObservables);
  }

  createFaqs(): Observable<any[]> {
    const faqCreateObservables: Observable<any>[] = [];
    this.faqArr.forEach((val) => {
      if (val.question !== "" && val.answer !== "") {
        faqCreateObservables.push(this.listingsService.createListingFAQ({
          listing_id: this.listingId,
          question: val.question,
          answer: val.answer,
        }).pipe(catchError(error => of(error))));
      }
    })
    return forkJoin(faqCreateObservables);
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

    //CMS
    const overview: string = $("#overview").html();
    const problem: string = $("#problem").html();
    const outcome: string = $("#outcome").html();
    const solution: string = $("#solution").html();

    this.listingData = {
      title, category, tagline, mission, overview,
      problem, outcome, solution, listing_url, listing_email,
      listing_status, pics, locations
    };

    this.subscriptions.push((await this.listingsService.createListing(this.listingData).subscribe(
      (res) => {
        console.log(res);
        this.listingId = res["data"]["listing_id"];
      },
      (err) => {
        console.log(err);
        this.snackbarService.openSnackBar(
          this.snackbarService.DialogList.create_listing.error,
          false
        );
      },
      () => {
        const combinedObservables = forkJoin([this.createFaqs(), this.createHashtags(), this.createJobs(), this.createMilestones()]);
        this.subscriptions.push(combinedObservables.subscribe({
          next: res => console.log(res),
          error: err => {
            console.log(err);
            this.snackbarService.openSnackBar(
              this.snackbarService.DialogList.create_listing.error,
              false
            );
          },
          complete: () => {
            this.snackbarService.openSnackBar(
              this.snackbarService.DialogList.create_listing.success,
              true
            );
            this.router.navigate(["/listing/" + this.listingId]);
          }
        }));
      }
    )))
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
