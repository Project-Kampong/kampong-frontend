// Angular Imports
import { Component, OnDestroy, OnInit } from "@angular/core";
import { COMMA, ENTER, SPACE } from "@angular/cdk/keycodes";
import { FormGroup, FormBuilder, ValidationErrors } from "@angular/forms";
import { MatChipInputEvent } from "@angular/material/chips";
import { Router, ActivatedRoute } from "@angular/router";

// Services
import { ListingsService } from "@app/services/listings.service";
import { SnackbarService } from "@app/services/snackbar.service";

// Util
import { locationList } from "@app/util/locations";
import { categoryList } from "@app/util/categories";

// Interfaces
import {
  editListingForm,
  EditListingFAQ,
  EditListingJobs,
  EditListingMilestones,
  EditListing,
  originalImagesCheck,
  EditListingHashtags,
} from "@app/interfaces/listing";
import { CategoryFilter, LocationFilter } from "@app/interfaces/filters";
import { forkJoin, Observable, of, Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';

declare var $: any;

@Component({
  selector: "app-edit-listing",
  templateUrl: "./edit-listing.component.html",
  styleUrls: ["./edit-listing.component.scss"],
})
export class EditListingComponent implements OnInit, OnDestroy {
  readonly separatorKeysCodes: number[] = [ENTER, COMMA, SPACE];
  listingForm: FormGroup;
  listingData: EditListing;
  listingId: string = "";
  removable: boolean = true;
  categoryGroup: Array<CategoryFilter>;
  locationGroup: Array<LocationFilter>;
  listingImages: File[] = [];
  listingImagesDisplay: string[] = [];
  originalImages: originalImagesCheck[] = [];
  hashtags: EditListingHashtags[] = [];
  originalHashtags: number[] = [];
  milestoneArr: EditListingMilestones[] = [];
  originalMilestoneIds: number[] = [];
  jobArr: EditListingJobs[] = [];
  originalJobIds: number[] = [];
  faqArr: EditListingFAQ[] = [];
  originalFaqIds: number[] = [];
  subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    public listingsService: ListingsService,
    private router: Router,
    public snackbarService: SnackbarService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.categoryGroup = categoryList;
    this.locationGroup = locationList;
    this.listingId = this.route.snapshot.params["id"];
    this.listingForm = this.fb.group({
      ...editListingForm,
    });

    this.listingsService.getSelectedListing(this.listingId).subscribe(
      (res) => {
        //Setup
        const listingData = res["data"];
        this.listingForm.patchValue(listingData);
        this.jobArr = listingData["jobs"];
        this.originalJobIds = this.jobArr.map((val) => val.job_id);
        this.faqArr = listingData["faqs"];
        this.originalFaqIds = this.faqArr.map((val) => val.faq_id);
        this.milestoneArr = listingData["milestones"];
        this.originalMilestoneIds = this.milestoneArr.map((val) => val.milestone_id);
        this.hashtags = listingData["tags"];
        this.originalHashtags = this.hashtags.map((val) => val.hashtag_id);
        this.listingImagesDisplay = listingData["pics"];
        this.listingImages = Array(this.listingImagesDisplay.length).fill(null);

        this.listingImagesDisplay.forEach((val) => {
          this.originalImages.push({ image: val, check: true });
        });

        this.sortMilestone();

        $("#overview").html(this.parseStory(listingData["overview"]));
        $("#problem").html(this.parseStory(listingData["problem"]));
        $("#solution").html(this.parseStory(listingData["solution"]));
        $("#outcome").html(this.parseStory(listingData["outcome"]));

      },
      (err) => {
        console.log(err);
      }
    );

    // CMS
    $(".action-container .action-btn").on("click", function () {
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
    const value = (
      "#" + event.value.replace(/[&\/\\#,+()$~%. '":*?<>\[\]{}]/g, "")
    ).trim();
    if (this.hashtags.length === 3 || value === "#" || event.value.length < 3) {
      return;
    }
    this.hashtags.push({
      hashtag_id: null,
      tag: value,
    });
    event.input.value = "";
  }

  removeHashtag(tag: string): void {
    const removeIndex = this.hashtags.map((e) => e.tag).indexOf(tag);
    this.hashtags.splice(removeIndex, 1);
  }

  parseStory(story: string): string {
    const result = story.replace(/&lt;/g, "<").replace(/<a/g, "<a target='_blank'");
    return result;
  }

  uploadImage(event: Event): void {
    if (
      this.listingImagesDisplay.length === 5 &&
      this.listingImages.length === 5
    ) {
      return;
    }
    const reader: FileReader = new FileReader();
    reader.onload = (e) => {
      this.listingImagesDisplay.push(reader.result.toString());
    };
    try {
      reader.readAsDataURL((event.target as HTMLInputElement).files[0]);
    } catch (error) {
      console.log(error);
      return;
    }
    this.listingImages.push(<File>(event.target as HTMLInputElement).files[0]);
  }

  removeImage(i: number): void {
    const checkImage: string = this.listingImagesDisplay[i];
    this.originalImages.forEach((val) => {
      if (checkImage === val.image) {
        val.check = false;
      }
    });
    this.listingImagesDisplay.splice(i, 1);
    this.listingImages.splice(i, 1);
  }

  addMilestone(): void {
    this.milestoneArr.push({
      milestone_id: null,
      milestone_description: "",
      date: new Date(),
    });
    this.milestoneArr.sort((a, b) => {
      const result: number = new Date(a.date).valueOf() - new Date(b.date).valueOf();
      return result;
    });
  }

  sortMilestone(): void {
    this.milestoneArr = this.milestoneArr.sort((a, b) => {
      const result: number =
        new Date(a.date).valueOf() - new Date(b.date).valueOf();
      return result;
    });
  }

  removeMilestone(i: number): void {
    this.milestoneArr.splice(i, 1);
  }

  addFAQ(): void {
    this.faqArr.push({
      faq_id: null,
      question: "",
      answer: "",
    });
  }
  removeFAQ(i: number): void {
    this.faqArr.splice(i, 1);
  }

  addDescription(): void {
    this.jobArr.push({
      job_id: null,
      job_title: "",
      job_description: "",
    });
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

  updateMilestones(): Observable<any[]> {
    const checkMilestones: number[] = [];
    const milestoneEditObservables: Observable<any>[] = [];
    this.milestoneArr.forEach((val) => {
      if (val.milestone_id === null && val.milestone_description !== "" && val.date !== null) {
        milestoneEditObservables.push(this.listingsService.createListingMilestones({
          listing_id: this.listingId,
          description: val.milestone_description,
          date: val.date
        }).pipe(catchError(error => of(error))));
      } else if (val.milestone_id && val.date !== null && val.milestone_description !== "") {
        checkMilestones.push(val.milestone_id);
        milestoneEditObservables.push(this.listingsService.updateMilestone(val.milestone_id, {
          description: val.milestone_description,
          date: val.date,
        }).pipe(catchError(error => of(error))));
      }
    })
    this.originalMilestoneIds.forEach((val) => {
      if (!checkMilestones.includes(val)) {
        milestoneEditObservables.push(this.listingsService.removeMilestone(val).pipe(catchError(error => of(error))));
      }
    })
    return forkJoin(milestoneEditObservables);
  }

  updateHashtags(): Observable<any[]> {
    const checkHashtags: number[] = [];
    const hashtagsEditObservables: Observable<any>[] = [];
    this.hashtags.forEach((val) => {
      if (val.hashtag_id === null) {
        hashtagsEditObservables.push(this.listingsService.createListingHashtags({
          listing_id: this.listingId,
          tag: val.tag,
        }).pipe(catchError(error => of(error))));
      } else {
        checkHashtags.push(val.hashtag_id);
      }
    })
    this.originalHashtags.forEach((val) => {
      if (!checkHashtags.includes(val)) {
        hashtagsEditObservables.push(this.listingsService.removeHashtags(val).pipe(catchError(error => of(error))));
      }
    })
    return forkJoin(hashtagsEditObservables);
  }

  updateJobs(): Observable<any[]> {
    const checkJobs: number[] = [];
    const jobEditObservables: Observable<any>[] = [];
    this.jobArr.forEach((val) => {
      if (val.job_id === null && val.job_title !== "" && val.job_description !== "") {
        jobEditObservables.push(this.listingsService.createListingJobs({
          listing_id: this.listingId,
          job_title: val.job_title,
          job_description: val.job_description,
        }).pipe(catchError(error => of(error))));
      } else if (val.job_id && val.job_title !== "" && val.job_description !== "") {
        checkJobs.push(val.job_id);
        jobEditObservables.push(this.listingsService.updateJobs(val.job_id, {
          job_title: val.job_title,
          job_description: val.job_description
        }).pipe(catchError(error => of(error))));
      }
    })
    this.originalJobIds.forEach((val) => {
      if (!checkJobs.includes(val)) {
        jobEditObservables.push(this.listingsService.removeListingJobs(val).pipe(catchError(error => of(error))));
      }
    })
    return forkJoin(jobEditObservables);
  }

  updateFaqs(): Observable<any[]> {
    const checkFaqs: number[] = [];
    const faqEditObservables: Observable<any>[] = [];
    this.faqArr.forEach((val) => {
      if (val.faq_id === null && val.question !== "" && val.answer !== "") {
        faqEditObservables.push(this.listingsService.createListingFAQ({
          listing_id: this.listingId,
          question: val.question,
          answer: val.answer,
        }).pipe(catchError(error => of(error))));
      } else if (val.faq_id && val.question !== "" && val.answer !== "") {
        checkFaqs.push(val.faq_id);
        faqEditObservables.push(this.listingsService.updateFAQ(val.faq_id, {
          question: val.question,
          answer: val.answer,
        }).pipe(catchError(error => of(error))));
      }
    })
    this.originalFaqIds.forEach((val) => {
      if (!checkFaqs.includes(val)) {
        faqEditObservables.push(this.listingsService.removeFAQ(val).pipe(catchError(error => of(error))));
      }
    })
    return forkJoin(faqEditObservables);
  }

  async updateListing(): Promise<void> {
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

    const overview: string = $("#overview").html();
    const problem: string = $("#problem").html();
    const outcome: string = $("#outcome").html();
    const solution: string = $("#solution").html();

    this.listingData = { title, category, tagline, mission, overview,
      problem, outcome, solution, listing_url, listing_email, 
      listing_status, pics, locations,
    };

    this.subscriptions.push((await this.listingsService.updateListing(this.listingId, this.listingData, this.listingImages, this.originalImages)).subscribe(
      (res) => {},
      (err) => {
        console.log(err);
        this.snackbarService.openSnackBar(
          this.snackbarService.DialogList.update_listing.error,
          false
        );
        return;
      },
      () => {

        const combinedObservables = forkJoin([this.updateHashtags(), this.updateJobs(), this.updateMilestones(), this.updateFaqs()]);
        this.subscriptions.push(combinedObservables.subscribe({
          next: res => console.log(res),
          error: err => {
            console.log(err);
            this.snackbarService.openSnackBar(
              this.snackbarService.DialogList.update_listing.error,
              false
            );
          },
          complete: () => {
            this.snackbarService.openSnackBar(
              this.snackbarService.DialogList.update_listing.success,
              true
            );
            this.router.navigate(["/listing/" + this.listingId])
          }
        }));

      }
    ));
  }

  removeListing(): void {
    if (confirm("Are you sure you want to delete " + this.listingForm.value.title + "? This action is currently not reversible.")) {
      this.listingsService.removeListing(this.listingId).subscribe(
        (data) => {
          console.log(data);
          this.snackbarService.openSnackBar(
            this.snackbarService.DialogList.delete_listing.success,
            true
          );
          this.router.navigate(["/profile"]);
        },
        (err) => {
          this.snackbarService.openSnackBar(
            this.snackbarService.DialogList.delete_listing.error,
            false
          );
          this.router.navigate(["/profile"]);
        }
      );
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}

/*


  updateMilestones(): Promise<void>[] {
    const checkMilestones: number[] = [];
    const milestoneEditPromises: Promise<void>[] = [];
    this.milestoneArr.forEach((val) => {
      if (val.milestone_id === null && val.milestone_description !== "" && val.date !== null) {
        milestoneEditPromises.push(new Promise((resolve, reject) => {
          this.listingsService.createListingMilestones({
            listing_id: this.listingId,
            description: val.milestone_description,
            date: val.date,
          }).subscribe(
            (res) => {},
            (err) => {
              console.log(err);
              reject();
            }
          )
          resolve();
        }))
      } else if (val.milestone_id && val.date !== null && val.milestone_description !== "") {
        checkMilestones.push(val.milestone_id);
        milestoneEditPromises.push(new Promise((resolve, reject) => {
          this.listingsService.updateMilestone(val.milestone_id, {
            description: val.milestone_description,
            date: val.date,
          }).subscribe(
            (res) => {},
            (err) => {
              console.log(err);
              reject();
            }
          )
          resolve();
        }))
      }
    })
    
    this.originalMilestoneIds.forEach((val) => {
      if (!checkMilestones.includes(val)) {
        milestoneEditPromises.push(new Promise((resolve, reject) => {
          this.listingsService.removeMilestone(val).subscribe(
            (res) => {},
            (err) => {
              console.log(err);
              reject();
            }
          );
          resolve();
        }))
      }
    })
    return milestoneEditPromises;
  }

    updateHashtags(): Promise<void>[] {
    const checkHashtags: number[] = [];
    const hashtagEditPromises: Promise<void>[] = [];
    this.hashtags.forEach((val) => {
      if (val.hashtag_id === null) {
        hashtagEditPromises.push(new Promise((resolve, reject) => {
          this.listingsService.createListingHashtags({
            listing_id: this.listingId,
            tag: val.tag,
          }).subscribe(
            (res) => {},
            (err) => {
              console.log(err);
              reject();
            }
          )
          resolve();
        }))
      } else {
        checkHashtags.push(val.hashtag_id);
      }
    })

    this.originalHashtags.forEach((val) => {
      if (!checkHashtags.includes(val)) {
        hashtagEditPromises.push(new Promise((resolve, reject) => {
          this.listingsService.removeHashtags(val).subscribe(
            (res) => {},
            (err) => {
              console.log(err);
              reject();
            }
          );
          resolve();
        }))
      }
    })
    return hashtagEditPromises;
  }

    updateJobs(): Promise<void>[] {
    const checkJobs: number[] = [];
    const jobEditPromises: Promise<void>[] = [];
    this.jobArr.forEach((val) => {
      console.log(val);
      if (val.job_id === null && val.job_title !== "" && val.job_description !== "") {
        jobEditPromises.push(new Promise((resolve, reject) => {
          this.listingsService.createListingJobs({
            listing_id: this.listingId,
            job_title: val.job_title,
            job_description: val.job_description,
          }).subscribe(
            (res) => {},
            (err) => {
              console.log(err);
              reject();
            }
          )
          resolve();
        }))
      } else if (val.job_id && val.job_title !== "" && val.job_description !== "") {
        checkJobs.push(val.job_id);
        jobEditPromises.push(new Promise((resolve, reject) => {
          this.listingsService.updateJobs(val.job_id, {
            job_title: val.job_title,
            job_description: val.job_description
          }).subscribe(
            (res) => {},
            (err) => {
              console.log(err);
              reject();
            }
          )
          resolve();
        }))
      }
    })

    this.originalJobIds.forEach((val) => {
      if (!checkJobs.includes(val)) {
        jobEditPromises.push(new Promise((resolve, reject) => {
          this.listingsService.removeListingJobs(val).subscribe(
            (res) => {},
            (err) => {
              console.log(err);
              reject();
            }
          );
          resolve();
        }))
      }
    })
    return jobEditPromises;
  }

    updateFaqs(): Promise<void>[] {
    const checkFaqs: number[] = [];
    const faqEditPromises: Promise<void>[] = [];
    this.faqArr.forEach((val) => {
      console.log(val);
      if (val.faq_id === null && val.question !== "" && val.answer !== "") {
        faqEditPromises.push(new Promise((resolve, reject) => {
          this.listingsService.createListingFAQ({
            listing_id: this.listingId,
            question: val.question,
            answer: val.answer,
          }).subscribe(
            (res) => {},
            (err) => {
              console.log(err);
              reject();
            }
          )
          resolve();
        }))
      } else if (val.faq_id && val.question !== "" && val.answer !== "") {
        checkFaqs.push(val.faq_id);
        faqEditPromises.push(new Promise((resolve, reject) => {
          this.listingsService.updateFAQ(val.faq_id, {
            question: val.question,
            answer: val.answer,
          }).subscribe(
            (res) => {},
            (err) => {
              console.log(err);
              reject();
            }
          )
          resolve();
        }))
      }
    })


    this.originalFaqIds.forEach((val) => {
      if (!checkFaqs.includes(val)) {
        faqEditPromises.push(new Promise((resolve, reject) => {
          this.listingsService.removeFAQ(val).subscribe(
            (res) => {},
            (err) => {
              console.log(err);
              reject();
            }
          );
          resolve();
        }))
      }
    })
    return faqEditPromises;
  }
*/