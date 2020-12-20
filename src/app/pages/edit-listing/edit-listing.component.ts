// Angular Imports
import { Component, OnInit } from '@angular/core';
import { COMMA, ENTER, SPACE } from '@angular/cdk/keycodes';
import { FormGroup, FormBuilder, ValidationErrors } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { Router, ActivatedRoute } from '@angular/router';

// Services
import { ListingsService } from '@app/services/listings.service';
import { SnackbarService } from '@app/services/snackbar.service';

// Interfaces
import {
  EditListingForm,
  EditListingFAQ,
  EditListingJobs,
  EditListingMilestones,
  EditListing,
  OriginalImagesCheck,
  EditListingHashtags,
} from '@app/interfaces/listing';

// Stores
import { categoriesStore } from '@app/store/categories-store';
import { locationsStore } from '@app/store/locations-store';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { MatDialog } from '@angular/material';
import { CropImageDialogComponent } from '@app/components/crop-image-dialog/crop-image-dialog.component';

declare var $: any;

@Component({
  selector: 'app-edit-listing',
  templateUrl: './edit-listing.component.html',
  styleUrls: ['./edit-listing.component.scss'],
})
export class EditListingComponent implements OnInit {
  readonly separatorKeysCodes: number[] = [ENTER, COMMA, SPACE];
  listingForm: FormGroup;
  listingData: EditListing;
  listingId: string;
  removable: boolean;
  locationsStore = locationsStore;
  categoriesStore = categoriesStore;
  listingImages: File[];
  listingImagesDisplay: string[];
  originalImages: OriginalImagesCheck[];
  hashtags: Array<EditListingHashtags>;
  originalHashtags: Array<EditListingHashtags>;
  milestoneArr: Array<EditListingMilestones>;
  jobArr: Array<EditListingJobs>;
  faqArr: Array<EditListingFAQ>;

  imageChangedEvent: any = '';
  croppedImage: any = '';

  constructor(
    private fb: FormBuilder,
    public listingsService: ListingsService,
    private router: Router,
    public snackbarService: SnackbarService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
  ) {
    this.listingImages = [];
    this.listingImagesDisplay = [];
    this.hashtags = [];
    this.milestoneArr = [];
    this.jobArr = [];
    this.faqArr = [];
    this.listingId = '';
    this.removable = true;
    this.originalImages = [];
    this.originalHashtags = [];
  }

  ngOnInit() {
    this.listingId = this.route.snapshot.params['id'];
    this.listingForm = this.fb.group({
      ...EditListingForm,
    });

    this.listingsService.getSelectedListing(this.listingId).subscribe(
      (res) => {
        this.listingForm.patchValue(res['data']);
        this.listingImagesDisplay = res['data'].pics;
        this.listingImages = Array(this.listingImagesDisplay.length).fill(null);
        this.listingImagesDisplay.forEach((val) => {
          this.originalImages.push({ image: val, check: true });
        });
      },
      (err) => {
        console.log(err);
      },
    );

    this.listingsService.getSelectedListingHashtags(this.listingId).subscribe(
      (res) => {
        const hashtagsData: Array<any> = res.data.map((data) => {
          return {
            hashtag_id: data.hashtag_id,
            tag: data.tag,
          };
        });
        this.hashtags = hashtagsData;
        this.originalHashtags = res.data.map((data) => data.hashtag_id);
        console.log(this.originalHashtags);
      },
      (err) => {
        console.log(err);
      },
    );

    this.listingsService.getSelectedListingMilestones(this.listingId).subscribe(
      (res) => {
        const milestonesData: Array<any> = res.data;
        milestonesData.forEach((val) => {
          this.milestoneArr.push({
            milestone_id: val.milestone_id,
            description: val['milestone_description'],
            date: val.date,
          });
        });
      },
      (err) => {
        console.log(err);
      },
    );

    this.listingsService.getSelectedListingFAQ(this.listingId).subscribe(
      (res) => {
        const faqData: Array<any> = res.data;
        faqData.forEach((val) => {
          this.faqArr.push({
            faq_id: val.faq_id,
            question: val.question,
            answer: val.answer,
          });
        });
      },
      (err) => {
        console.log(err);
      },
    );

    this.listingsService.getSelectedListingJobs(this.listingId).subscribe(
      (res) => {
        const jobData: Array<any> = res.data;
        jobData.forEach((val) => {
          this.jobArr.push({
            job_id: val.job_id,
            title: val.job_title,
            description: val.job_description,
          });
        });
      },
      (err) => {
        console.log(err);
      },
    );

    // CMS
    $('.action-container .action-btn').on('click', function () {
      const cmd = $(this).data('command');
      if (cmd == 'createlink') {
        const url = prompt('Enter the link here: ');
        if (url === null) {
          return;
        }
        document.execCommand(cmd, false, url);
      } else if (cmd == 'formatBlock') {
        const size = $(this).data('size');
        document.execCommand(cmd, false, size);
      } else {
        document.execCommand(cmd, false, null);
      }
    });
  }

  addHashtag(event: MatChipInputEvent): void {
    const value = ('#' + event.value.replace(/[&\/\\#,+()$~%. '":*?<>\[\]{}]/g, '')).trim();
    if (this.hashtags.length === 3 || value === '#' || event.value.length < 3) {
      return;
    }
    this.hashtags.push({
      hashtag_id: null,
      tag: value,
    });
    event.input.value = '';
  }

  removeHashtag(tag: string): void {
    const removeIndex = this.hashtags.map((e) => e.tag).indexOf(tag);
    this.hashtags.splice(removeIndex, 1);
  }

  /**
   *
   * Test
   */
  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    const dialogRef = this.dialog.open(CropImageDialogComponent, {
      data: {
        title: 'Crop Image',
        imageChangedEvent: event,
        croppedImage: '',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      console.log(result);
      this.croppedImage = result.imageCropped;

      // this.listingImages.push(<File>(result.imageCropped as HTMLInputElement).files[0]);
    });
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
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

  uploadImage(event: Event): void {
    if (this.listingImagesDisplay.length === 5 && this.listingImages.length === 5) {
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
    console.log(<File>(event.target as HTMLInputElement).files[0]);
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
      description: '',
      date: new Date(),
    });
    this.milestoneArr.sort((a, b) => {
      const result: number = new Date(a.date).valueOf() - new Date(b.date).valueOf();
      return result;
    });
  }

  sortMilestone(): void {
    this.milestoneArr = this.milestoneArr.sort((a, b) => {
      const result: number = new Date(a.date).valueOf() - new Date(b.date).valueOf();
      return result;
    });
  }

  removeMilestone(i: number): void {
    this.milestoneArr.splice(i, 1);
  }

  addFAQ(): void {
    this.faqArr.push({
      faq_id: null,
      question: '',
      answer: '',
    });
  }
  removeFAQ(i: number): void {
    this.faqArr.splice(i, 1);
  }

  addDescription(): void {
    this.jobArr.push({
      job_id: null,
      title: '',
      description: '',
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

  async updateListing(): Promise<void> {
    if (this.getFormValidationErrors() === true) {
      this.snackbarService.openSnackBar('Please complete the form', false);
      return;
    }

    const title: string = this.listingForm.value.title;
    const category: string = this.listingForm.value.category;
    const tagline: string = this.listingForm.value.tagline;
    const mission: string = this.listingForm.value.mission;
    const overview: string = this.listingForm.value.overview;
    const problem: string = this.listingForm.value.problem;
    const outcome: string = this.listingForm.value.outcome;
    const solution: string = this.listingForm.value.solution;
    const listing_url: string = this.listingForm.value.listing_url;
    const listing_email: string = this.listingForm.value.listing_email;
    const listing_status: string = 'ongoing';
    const locations: string[] = this.listingForm.value.locations;
    const pics: string[] = [null, null, null, null, null];

    this.listingData = {
      title,
      category,
      tagline,
      mission,
      overview,
      problem,
      outcome,
      solution,
      listing_url,
      listing_email,
      listing_status,
      pics,
      locations,
    };

    (await this.listingsService.updateListing(this.listingId, this.listingData, this.listingImages, this.originalImages)).subscribe(
      (res) => {
        this.milestoneArr.forEach((val) => {
          if (val.milestone_id == null && val.date != null && val.description != '') {
            this.listingsService
              .createListingMilestones({
                listing_id: this.listingId,
                description: val.description,
                date: val.date,
              })
              .subscribe(
                (res) => {},
                (err) => {
                  console.log(err);
                },
              );
          } else if (val.milestone_id && val.date != null && val.description != '') {
            this.listingsService
              .updateMilestone(val.milestone_id, {
                description: val.description,
                date: val.date,
              })
              .subscribe(
                (res) => {},
                (err) => {
                  console.log(err);
                },
              );
          }
        });

        const removeHashtagPromises: Promise<any>[] = [];

        this.originalHashtags.forEach((val) => {
          removeHashtagPromises.push(
            new Promise((resolve, reject) => {
              this.listingsService.removeHashtags(val).subscribe(
                (res) => {
                  resolve();
                },
                (err) => {
                  reject();
                },
              );
            }),
          );
        });

        Promise.all(removeHashtagPromises).then(() => {
          this.hashtags.forEach((val) => {
            this.listingsService
              .createListingHashtags({
                listing_id: this.listingId,
                tag: val.tag,
              })
              .subscribe(
                (res) => {},
                (err) => {
                  console.log(err);
                },
              );
          });
        });

        this.jobArr.forEach((val) => {
          if (val.job_id == null && val.title != '' && val.description != '') {
            this.listingsService
              .createListingJobs({
                listing_id: this.listingId,
                job_title: val.title,
                job_description: val.description,
              })
              .subscribe(
                (res) => {},
                (err) => {
                  console.log(err);
                },
              );
          } else if (val.job_id && val.title != '' && val.description != '') {
            this.listingsService
              .updateJobs(val.job_id, {
                job_title: val.title,
                job_description: val.description,
              })
              .subscribe(
                (res) => {},
                (err) => {
                  console.log(err);
                },
              );
          }
        });

        this.faqArr.forEach((val) => {
          if (val.faq_id == null && val.question != '' && val.answer != '') {
            this.listingsService
              .createListingFAQ({
                listing_id: this.listingId,
                question: val.question,
                answer: val.answer,
              })
              .subscribe(
                (res) => {},
                (err) => {
                  console.log(err);
                },
              );
          } else if (val.faq_id && val.answer != '' && val.question != '') {
            this.listingsService
              .updateFAQ(val.faq_id, {
                question: val.question,
                answer: val.answer,
              })
              .subscribe(
                (res) => {},
                (err) => {
                  console.log(err);
                },
              );
          }
        });

        /*
        // To change, await for new listing/categories to be updated before changing
        const removeLocationPromises: Promise<any>[] = [];
        const removeLocationArr: number[] = this.listingData.locations.map((x) => x.hashtag_id);
        removeHashtagArr.forEach((val) => {
          removeHashtagPromises.push(new Promise((resolve, reject) => {
            this.listingsService.removeHashtags(val);
            resolve();
          }))
        });
        Promise.all(removeHashtagPromises).then(() =>{
          this.hashtags.forEach((val) => {
            this.listingsService.createListingHashtags(val.tag);
          })
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
        */
      },

      (err) => {
        console.log(err);
        this.snackbarService.openSnackBar(this.snackbarService.DialogList.update_listing.error, false);
        return;
      },

      () => {
        this.snackbarService.openSnackBar(this.snackbarService.DialogList.update_listing.success, true);
        this.router.navigate(['/listing/' + this.listingId]);
      },
    );
  }

  removeListing(): void {
    if (confirm('Are you sure you want to delete ' + this.listingForm.value.title + '? This action is currently not reversible.')) {
      this.listingsService.removeListing(this.listingId).subscribe(
        (data) => {
          console.log(data);
          this.snackbarService.openSnackBar(this.snackbarService.DialogList.delete_listing.success, true);
          this.router.navigate(['/profile']);
        },
        (err) => {
          this.snackbarService.openSnackBar(this.snackbarService.DialogList.delete_listing.error, false);
          this.router.navigate(['/profile']);
        },
      );
    }
  }
}

/*
import { Component, OnInit } from "@angular/core";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { FormGroup, FormBuilder, ValidationErrors } from "@angular/forms";
import { MatChipInputEvent } from "@angular/material/chips";

import { Router, ActivatedRoute } from "@angular/router";

import { ListingsService } from "@app/services/listings.service";
import { SnackbarService } from "@app/services/snackbar.service";
import { categoryList } from "@app/util/categories";
import { locationList } from "@app/util/locations";


// Interfaces
import { CreateListingForm, CreateListingStoryForm } from "@app/interfaces/listing";
import { CategoryFilter, LocationFilter } from '@app/interfaces/filters';
import { CropImageDialogComponent } from './../../components/crop-image-dialog/crop-image-dialog.component';

declare var $: any;

@Component({
  selector: "app-edit-listing",
  templateUrl: "./edit-listing.component.html",
  styleUrls: ["./edit-listing.component.scss"],
})
export class EditListingComponent implements OnInit {
  
  listingId: string;
  listingForm: FormGroup;
  categoryGroup: Array<CategoryFilter>;
  locationGroup: Array<LocationFilter>;
  fileDisplayArr = [];
  fileArr = [];
  fileLimit = false;
  fileCount = 0;

  milestoneArr = [];
  faqArr = [];

  locationList = [];
  lookingForArr = [];

  constructor(
    private fb: FormBuilder,
    public ListingsService: ListingsService,
    private router: Router,
    private route: ActivatedRoute,
    public SnackbarService: SnackbarService
  ) {}

  ngOnInit() {
    
    this.categoryGroup = categoryList;
    this.locationGroup = locationList;

    window.scroll(0, 0);

    this.listingId = this.route.snapshot.params["id"];
    this.listingForm = this.fb.group({
      ...CreateListingForm,
      ...CreateListingStoryForm,
    });

    // Grab data
    this.ListingsService.getSelectedListing(this.listingId).subscribe(
      (data) => {
        console.log(data["data"]);
        this.listingForm.patchValue(data["data"]);
        // Handle Images

      }
    );

    // Grab Milestone
    this.ListingsService.getSelectedListingMilestones(this.listingId).subscribe(
      (data) => {
        const milestonesData = data["data"];
        if (milestonesData.length == 0) {
          this.milestoneArr.push({ date: new Date(), description: "" });
        } else {
          milestonesData.map((x) => {
            this.milestoneArr.push({
              date: x.date,
              description: x.description,
              listing_id: x.listing_id,
              milestone_id: x.milestone_id,
            });
          });
        }
      }
    );
    // Grab FAQ
    this.ListingsService.getSelectedListingFAQ(this.listingId).subscribe(
      (data) => {
        const faqData = data["data"];
        if (faqData.length == 0) {
          this.faqArr.push({ questions: "", answer: "" });
        } else {
          faqData.map((x) => {
            this.faqArr.push({
              questions: x.question,
              answer: x.answer,
              listing_id: x.listing_id,
              faq_id: x.faq_id,
            });
          });
        }
      }
    );
    // Grab Hashtags
    this.ListingsService.getSelectedListingHashtags(this.listingId).subscribe(
      (data) => {
        const hashtagsData = data["data"];
        hashtagsData.map((x) => {
          this.hashtags.push({ tag: x.tag, hashtag_id: x.hashtag_id });
        });
      }
    );

    // Grab Jobs
    this.ListingsService.getSelectedListingJobs(this.listingId).subscribe(
      (data) => {
        console.log(data);
        const jobsList = data["data"];
        jobsList.map((x) => {
          this.lookingForArr.push({
            skills: x.job_title,
            description: x.job_description,
            job_id: x.job_id,
          });
        });
        this.lookingForArr.push({
          skills: "",
          description: "",
        });
      }
    );

    // Grab Location
    this.ListingsService.getSelectedListingLocations(this.listingId).subscribe(
      (data) => {
        console.log(data);
        const locationData = data["data"];
        var tempLocation = [];
        // Carbon Copy of location
        this.LocationsetsCC = locationData;
        locationData.map((x) => {
          tempLocation.push(x.location_id);
        });
        this.listingForm.controls["LocationsList"].setValue(tempLocation);
        console.log(this.listingForm.value.LocationsList);
      }
    );

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
  }
  LocationsetsCC = [];
  // Submit Data
  saveListing() {
    if (this.getFormValidationErrors() == true) {
      this.SnackbarService.openSnackBar("Please complete the form", false);
      return;
    }
    var routeTo;
    const listingData = this.listingForm.value;
    console.log(listingData);
    var listingUpdates = new FormData();
    listingUpdates.append("title", listingData.title);
    if (listingData.category == "Create a Category") {
      listingUpdates.append("category", listingData.customCategory);
    } else {
      listingUpdates.append("category", listingData.category);
    }
    listingUpdates.append("tagline", listingData.tagline);
    listingUpdates.append("mission", listingData.mission);
    listingUpdates.append("listing_email", listingData.listing_email);
    for (var i = 0; i < 5; i++) {
      if (this.fileArr[i]) {
        listingUpdates.append("pic" + (i + 1), this.fileArr[i]);
      } else {
        listingUpdates.append("pic" + (i + 1), null);
      }
    }

    // Update Main Listing
    this.ListingsService.updateListing(
      this.listingId,
      listingUpdates
    ).subscribe(
      (data) => {
        console.log(data);
        this.ListingsService.UpdateListingStory(this.listingId, {
          overview: $("#output").html(),
        }).subscribe((data) => {
          console.log(data);
        });

        // Update Hashtags
        this.hashtagRemoveArr.map((x) => {
          this.ListingsService.removeHashtags(x).subscribe();
        });
        this.hashtags.map((x) => {
          if (x.hashtag_id == null) {
            this.ListingsService.createListingHashtags({
              listing_id: this.listingId,
              tag: x.tag,
            }).subscribe((data) => {
              console.log(data);
            });
          }
        });

        // Update Milestones
        this.milestoneRemoveArr.map((x) => {
          this.ListingsService.removeMilestone(x).subscribe();
        });
        this.milestoneArr.map((x) => {
          console.log(x);
          if (x.milestone_id == null && x.description != "" && x.date != null) {
            this.ListingsService.createListingMilestones({
              listing_id: this.listingId,
              description: x.description,
              date: x.date,
            }).subscribe();
          } else if (
            x.milestone_id != null &&
            x.description != "" &&
            x.date != null
          ) {
            this.ListingsService.updateMilestone(x.milestone_id, {
              description: x.description,
              date: x.date,
            }).subscribe();
          }
        });

        // Update FAQ
        this.faqRemoveArr.map((x) => {
          this.ListingsService.removeFAQ(x).subscribe();
        });
        this.faqArr.map((x) => {
          if (x.faq_id == null && x.questions != "" && x.answer != "") {
            this.ListingsService.createListingFAQ({
              listing_id: this.listingId,
              question: x.questions,
              answer: x.answer,
            }).subscribe();
          } else if (x.faq_id != null && x.questions != "" && x.answer != "") {
            this.ListingsService.updateFAQ(x.faq_id, {
              question: x.questions,
              answer: x.answer,
            }).subscribe();
          }
        });

        // Update Looking For
        // Remove Jobs
        this.jobsRemoveArr.map((x) => {
          this.ListingsService.removeListingJobs(x).subscribe();
        });
        // Update
        this.lookingForArr.map((x) => {
          if (x.skills != "" && x.description != "") {
            if (x.job_id != null) {
              this.ListingsService.updateJobs(x.job_id, {
                job_title: x.skills,
                job_description: x.description,
              }).subscribe();
            } else {
              // Create
              this.ListingsService.createListingJobs({
                listing_id: this.listingId,
                job_title: x.skills,
                job_description: x.description,
              }).subscribe();
            }
          } else {
            return;
          }
        });

        // Location
        listingData.LocationsList.map((x) => {
          var exist = false;
          this.LocationsetsCC.map((y) => {
            console.log(y.location_id, x);
            if (y.location_id == x) {
              console.log("match");
              exist = true;
            }
          });
          if (!exist) {
            // create location
            this.ListingsService.createListingLocation({
              listing_id: this.listingId,
              location_id: x,
            }).subscribe();
          }
        });

        // Delete location
        this.LocationsetsCC.map((x) => {
          var exist = false;
          listingData.LocationsList.map((y) => {
            if (x.location_id == y) {
              exist = true;
            }
          });
          if (!exist) {
            this.ListingsService.removeListingLocation(
              x.listing_location_id
            ).subscribe();
          }
        });
      },
      (err) => {
        this.SnackbarService.openSnackBar(
          this.SnackbarService.DialogList.update_listing.error,
          false
        );
        console.log(err);
        return;
      },
      () => {
        this.SnackbarService.openSnackBar(
          this.SnackbarService.DialogList.update_listing.success,
          true
        );
        this.router.navigate(["/listing/" + this.listingId]);
      }
    );
  }

  // End of Handle file section

  getFormValidationErrors() {
    var error = false;
    Object.keys(this.listingForm.controls).forEach((key) => {
      const controlErrors: ValidationErrors = this.listingForm.get(key).errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach((keyError) => {
          error = true;
        });
      }
    });
    if (this.fileCount == 0) {
      error = true;
    }
    return error;
  }

  // Chips UI and Data
  visible = true;
  selectable = false;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  hashtags = [];
  hashtagsError = false;
  hashtagRemoveArr = [];
  add(event: MatChipInputEvent): void {
    const value = "#" + event.value.replace(/[&\/\\#,+()$~%.'":*?<>{} ]/g, "");
    var checkVal = false;
    this.hashtags.map((x) => {
      if (x.tag == value) {
        checkVal = true;
        return;
      }
    });
    if (this.hashtags.length == 3) {
      this.hashtagsError = true;
    } else if (value != "#" && checkVal == false) {
      this.hashtagsError = false;
      const input = event.input;
      if ((value || "").trim()) {
        this.hashtags.push({ tag: value.trim() });
      }
      if (input) {
        input.value = "";
      }
    }
  }

  remove(data): void {
    const index = this.hashtags.indexOf(data);
    console.log(index);
    if (index >= 0) {
      if (data.hashtag_id != null) {
        this.hashtags.splice(index, 1);
        this.hashtagRemoveArr.push(data.hashtag_id);
        console.log(this.hashtagRemoveArr);
      } else {
        this.hashtags.splice(index, 1);
      }
      if (this.hashtags.length == 3) {
        this.hashtagsError = true;
      } else {
        this.hashtagsError = false;
      }
    }
  }

  // Milestones and FAQ UI
  addMilestone() {
    this.milestoneArr.push({ date: new Date(), description: "" });
    this.milestoneArr.sort((a, b) => {
      return <any>new Date(a.date) - <any>new Date(b.date);
    });
  }
  milestoneRemoveArr = [];
  removeMilestone(milestone, i) {
    this.milestoneArr.splice(i, 1);
    // Delete Milestone
    if (milestone.milestone_id != null) {
      this.milestoneRemoveArr.push(milestone.milestone_id);
      // this.ListingsService.removeMilestone(milestone.milestone_id).subscribe();
    }
  }
  sortMilestone() {
    this.milestoneArr = this.milestoneArr.sort((a, b) => {
      return <any>new Date(a.date) - <any>new Date(b.date);
    });
  }

  addFAQ() {
    this.faqArr.push({ questions: "", answer: "" });
  }
  faqRemoveArr = [];
  removeFAQ(faq, i) {
    this.faqArr.splice(i, 1);
    // Delete FAQ
    if (faq.faq_id != null) {
      this.faqRemoveArr.push(faq.faq_id);
      // this.ListingsService.removeFAQ(faq.faq_id).subscribe();
    }
  }

  // Remove Listing
  removeListing() {
    if (confirm("Are you sure you want to delete " + this.listingForm.value.title + "? This action is currently not reversible.")) {
      this.ListingsService.removeListing(this.listingId).subscribe(
        (data) => {
          console.log(data);
          this.SnackbarService.openSnackBar(
            this.SnackbarService.DialogList.delete_listing.success,
            true
          );
          this.router.navigate(["/profile"]);
        },
        (err) => {
          this.SnackbarService.openSnackBar(
            this.SnackbarService.DialogList.delete_listing.error,
            false
          );
          this.router.navigate(["/profile"]);
        }
      );
    }
  }

  // Looking for
  addDescription() {
    this.lookingForArr.push({ skills: "", description: "" });
    console.log(this.lookingForArr);
  }
  jobsRemoveArr = [];
  removeDescription(item, index) {
    this.lookingForArr.splice(index, 1);
    if (this.lookingForArr.length == 0) {
      this.lookingForArr.push({ skills: "", description: "" });
    }
    if (item.job_id != null) {
      this.jobsRemoveArr.push(item.job_id);
      console.log(this.jobsRemoveArr);
    }
  }
}
*/
