// Angular Imports
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { COMMA, ENTER, SPACE } from '@angular/cdk/keycodes';
import { FormGroup, FormBuilder, ValidationErrors } from '@angular/forms';
import { MatChipInputEvent, MatChipList } from '@angular/material/chips';
import { Router } from '@angular/router';

// Services
import { ListingsService } from '@app/services/listings.service';
import { SnackbarService } from '@app/services/snackbar.service';
import { AuthService } from '@app/services/auth.service';

// Interfaces
import { CreateListing, CreateListingLocation } from '@app/interfaces/listing';
import { createListingForm } from '@app/util/forms/listing';
import { catchError } from 'rxjs/operators';
import { forkJoin, Observable, of, Subscription, concat } from 'rxjs';
import { categoriesStore } from '@app/store/categories-store';
import { locationsStore } from '@app/store/locations-store';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { MatDialog } from '@angular/material';
import { CropImageDialogComponent } from '@app/components/crop-image-dialog/crop-image-dialog.component';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { dataURItoFile } from '@app/util/images/convertBase64ToFile';

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
  selector: 'app-create-listing',
  templateUrl: './create-listing.component.html',
  styleUrls: ['./create-listing.component.scss'],
})
export class CreateListingComponent implements OnInit, OnDestroy {
  readonly separatorKeysCodes: number[] = [ENTER, COMMA, SPACE];
  listingForm: FormGroup;
  validateForm!: FormGroup;
  listingData: CreateListing;
  listingId: string = '';
  removable: boolean = true;
  categoryGroup = categoriesStore;
  locationGroup = locationsStore;
  listingImages: File[] = [];
  listingImagesDisplay: string[] = [];
  hashtags: string[] = [];
  milestoneArr: AddListingMilestones[] = [{ milestone_description: '', date: new Date() }];
  jobArr: AddListingJobs[] = [];
  faqArr: AddListingFAQ[] = [];
  // locationArr: CreateListingLocation[] = [];
  subscriptions: Subscription[] = [];
  @ViewChild('categoryInput', { static: true }) categoryInput: ElementRef<HTMLInputElement>;
  @ViewChild('locationInput', { static: true }) locationInput: ElementRef<HTMLInputElement>;

  // selectedCategories: string[] = [];
  selectedLocations: string[] = [];
  imageChangedEvent: any = '';
  croppedImage: any = '';

  constructor(
    private fb: FormBuilder,
    private listingsService: ListingsService,
    private router: Router,
    private snackbarService: SnackbarService,
    private dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.listingForm = this.fb.group({
      ...createListingForm,
    });

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
    this.hashtags.push(value);
    event.input.value = '';
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
      console.log(reader.result);
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
    this.listingImagesDisplay.splice(i, 1);
    this.listingImages.splice(i, 1);
  }

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
      this.croppedImage = result.imageCropped;
      const file = dataURItoFile(result.imageCropped);
      this.listingImagesDisplay.push(result.imageCropped);
      this.listingImages.push(file);
    });
  }

  // imageCropped(event: ImageCroppedEvent) {
  //   this.croppedImage = event.base64;
  // }

  addMilestone(): void {
    this.milestoneArr.push({ milestone_description: '', date: new Date() });
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
      question: '',
      answer: '',
    });
  }
  removeFAQ(i: number): void {
    this.faqArr.splice(i, 1);
  }

  addDescription(): void {
    this.jobArr.push({ job_title: '', job_description: '' });
  }

  removeDescription(i: number): void {
    this.jobArr.splice(i, 1);
  }

  //Set the input to be empty
  addCategory(event: MatChipInputEvent): void {
    const input = event.input;
    if (input) {
      input.value = '';
    }
  }

  removeCategory(category: string): void {
    console.log('remove');
    const index = this.listingForm.controls.category.value.indexOf(category);

    if (index >= 0) {
      // this.selectedCategories.splice(index, 1);
      this.listingForm.controls.category.value.splice(index, 1);
    }
  }

  selectedCategory(event: MatAutocompleteSelectedEvent): void {
    if (!this.listingForm.controls.category.value.includes(event.option.value)) {
      // this.selectedCategories.push(event.option.viewValue);
      this.listingForm.controls.category.value.push(event.option.value);
    }
  }

  addLocation(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.selectedLocations.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeLocation(location: string): void {
    const index = this.selectedLocations.indexOf(location);

    if (index >= 0) {
      this.selectedLocations.splice(index, 1);
      this.listingForm.controls.locations.value.splice(index, 1);
    }
  }

  selectedLocation(event: MatAutocompleteSelectedEvent): void {
    if (!this.listingForm.controls.locations.value.includes(event.option.value)) {
      this.selectedLocations.push(event.option.viewValue);
      this.listingForm.controls.locations.value.push(event.option.value);
    }
  }

  // getFormValidationErrors(): boolean {
  //   Object.keys(this.listingForm.controls).forEach((key) => {
  //     const controlErrors: ValidationErrors = this.listingForm.get(key).errors;
  //     if (controlErrors != null) {
  //       return true;
  //     }
  //   });
  //   return false;
  // }

  createMilestones(): Observable<any[]>[] {
    const milestoneCreateObservables: Observable<any>[] = [];
    this.milestoneArr.forEach((val) => {
      if (val.milestone_description !== '' && val.date !== null) {
        milestoneCreateObservables.push(
          this.listingsService
            .createListingMilestones({
              listing_id: this.listingId,
              milestone_description: val.milestone_description,
              date: val.date,
            })
            .pipe(catchError((error) => of(error))),
        );
      }
    });
    return milestoneCreateObservables;
  }

  createHashtags(): Observable<any[]>[] {
    const hashtagsCreateObservables: Observable<any>[] = [];
    this.hashtags.forEach((val) => {
      hashtagsCreateObservables.push(
        this.listingsService
          .createListingHashtags({
            listing_id: this.listingId,
            tag: val,
          })
          .pipe(catchError((error) => of(error))),
      );
    });
    return hashtagsCreateObservables;
  }

  createJobs(): Observable<any[]>[] {
    const jobsCreateObservables: Observable<any>[] = [];
    this.jobArr.forEach((val) => {
      if (val.job_title !== '' && val.job_description !== '') {
        jobsCreateObservables.push(
          this.listingsService
            .createListingJobs({
              listing_id: this.listingId,
              job_title: val.job_title,
              job_description: val.job_description,
            })
            .pipe(catchError((error) => of(error))),
        );
      }
    });
    return jobsCreateObservables;
  }

  createFaqs(): Observable<any[]>[] {
    const faqCreateObservables: Observable<any>[] = [];
    this.faqArr.forEach((val) => {
      if (val.question !== '' && val.answer !== '') {
        faqCreateObservables.push(
          this.listingsService
            .createListingFAQ({
              listing_id: this.listingId,
              question: val.question,
              answer: val.answer,
            })
            .pipe(catchError((error) => of(error))),
        );
      }
    });
    return faqCreateObservables;
  }

  createLocations(): Observable<any[]>[] {
    const locationCreateObservables: Observable<any>[] = [];
    this.listingForm.value.locations.forEach((val) => {
      if (val !== '') {
        locationCreateObservables.push(
          this.listingsService
            .createListingLocation({
              listing_id: this.listingId,
              location_id: parseInt(val),
            })
            .pipe(catchError((error) => of(error))),
        );
      }
    });
    return locationCreateObservables;
  }

  async createListing(): Promise<void> {
    // if (this.getFormValidationErrors() === true) {
    //   this.snackbarService.openSnackBar('Please complete the form', false);
    //   return;
    // }

    console.log(this.listingForm);
    if (this.listingForm.status === 'VALID') {
      const listing_title: string = this.listingForm.value.listing_title;
      const category: string[] = this.listingForm.value.category;
      const tagline: string = this.listingForm.value.tagline;
      const mission: string = this.listingForm.value.mission;
      const listing_url: string = this.listingForm.value.listing_url;
      const listing_email: string = this.listingForm.value.listing_email;
      const listing_status: string = 'ongoing';
      const pics: string[] = [null, null, null, null, null];

      //CMS
      const overview: string = $('#overview').html();
      const problem: string = $('#problem').html();
      const outcome: string = $('#outcome').html();
      const solution: string = $('#solution').html();

      this.listingData = {
        listing_title,
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
      };
      console.log(this.listingData);
      this.subscriptions.push(
        this.listingsService.createListing(this.listingData).subscribe(
          (res) => {
            console.log(res);
            this.listingId = res['data']['listing_id'];
          },
          (err) => {
            console.log(err);
            this.snackbarService.openSnackBar(this.snackbarService.DialogList.create_listing.error, false);
          },
          () => {
            const combinedObservables: Observable<any>[] = [
              ...this.createFaqs(),
              ...this.createHashtags(),
              ...this.createJobs(),
              ...this.createMilestones(),
              ...this.createLocations(),
            ];
            this.subscriptions.push(
              concat(...combinedObservables).subscribe(
                (next) => {},
                (error) => {
                  console.log(error);
                  this.snackbarService.openSnackBar(this.snackbarService.DialogList.create_listing.error, false);
                },
                () => {
                  this.snackbarService.openSnackBar(this.snackbarService.DialogList.create_listing.success, true);
                  this.router.navigate(['/listing/' + this.listingId]);
                },
              ),
            );

            // const combinedObservables = forkJoin([
            //   this.createFaqs(),
            //   this.createHashtags(),
            //   this.createJobs(),
            //   this.createMilestones(),
            //   this.createLocations(),
            // ]);
            // this.subscriptions.push(
            //   combinedObservables.subscribe({
            //     next: (res) => console.log(res),
            //     error: (err) => {
            //       console.log(err);
            //       this.snackbarService.openSnackBar(this.snackbarService.DialogList.create_listing.error, false);
            //     },
            //     complete: () => {
            //       this.snackbarService.openSnackBar(this.snackbarService.DialogList.create_listing.success, true);
            //       this.router.navigate(['/listing/' + this.listingId]);
            //     },
            //   }),
            // );
          },
        ),
      );
    } else {
      this.snackbarService.openSnackBar('Please complete the form', false);
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
