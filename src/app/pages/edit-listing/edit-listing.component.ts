// Angular Imports
import { Component, OnInit } from "@angular/core";
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

declare var $: any;

@Component({
  selector: "app-edit-listing",
  templateUrl: "./edit-listing.component.html",
  styleUrls: ["./edit-listing.component.scss"],
})
export class EditListingComponent implements OnInit {
  readonly separatorKeysCodes: number[] = [ENTER, COMMA, SPACE];
  listingForm: FormGroup;
  listingData: EditListing;
  listingId: string;
  removable: boolean;
  categoryGroup: Array<CategoryFilter>;
  locationGroup: Array<LocationFilter>;
  listingImages: File[];
  listingImagesDisplay: string[];
  originalImages: originalImagesCheck[];
  hashtags: Array<EditListingHashtags>;
  originalHashtags: Array<EditListingHashtags>;
  milestoneArr: Array<EditListingMilestones>;
  jobArr: Array<EditListingJobs>;
  faqArr: Array<EditListingFAQ>;

  constructor(
    private fb: FormBuilder,
    public listingsService: ListingsService,
    private router: Router,
    public snackbarService: SnackbarService,
    private route: ActivatedRoute
  ) {
    this.listingImages = [];
    this.listingImagesDisplay = [];
    this.hashtags = [];
    this.milestoneArr = [];
    this.jobArr = [];
    this.faqArr = [];
    this.listingId = "";
    this.removable = true;
    this.originalImages = [];
    this.originalHashtags = [];
  }

  ngOnInit() {
    this.categoryGroup = categoryList;
    this.locationGroup = locationList;
    this.listingId = this.route.snapshot.params["id"];
    this.listingForm = this.fb.group({
      ...editListingForm,
    });

    this.listingsService.getSelectedListing(this.listingId).subscribe(
      (res) => {
        this.listingForm.patchValue(res["data"]);
        $("#overview").html(this.parseStory(res["data"]["overview"]));
        $("#problem").html(this.parseStory(res["data"]["problem"]));
        $("#solution").html(this.parseStory(res["data"]["solution"]));
        $("#outcome").html(this.parseStory(res["data"]["outcome"]));
        this.listingImagesDisplay = res["data"].pics;
        this.listingImages = Array(this.listingImagesDisplay.length).fill(null);
        this.listingImagesDisplay.forEach((val) => {
          this.originalImages.push({ image: val, check: true });
        });
      },
      (err) => {
        console.log(err);
      }
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
      }
    );

    this.listingsService.getSelectedListingMilestones(this.listingId).subscribe(
      (res) => {
        const milestonesData: Array<any> = res.data;
        milestonesData.forEach((val) => {
          this.milestoneArr.push({
            milestone_id: val.milestone_id,
            description: val.description,
            date: val.date,
          });
        });
      },
      (err) => {
        console.log(err);
      }
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
      }
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
      description: "",
      date: new Date(),
    });
    this.milestoneArr.sort((a, b) => {
      const result: number =
        new Date(a.date).valueOf() - new Date(b.date).valueOf();
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
      title: "",
      description: "",
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
          if (val.milestone_id == null && val.date != null && val.description != "") {
            this.listingsService.createListingMilestones({
              listing_id: this.listingId,
              description: val.description,
              date: val.date,
            }).subscribe(
              (res) => {},
              (err) => {
                console.log(err);
              }
            )
          } else if (val.milestone_id && val.date != null && val.description != "") {
            this.listingsService.updateMilestone(val.milestone_id, {
              description: val.description,
              date: val.date,
            }).subscribe(
              (res) => {},
              (err) => {
                console.log(err);
              }
              );
          }
        });

        const removeHashtagPromises: Promise<any>[] = [];

        this.originalHashtags.forEach((val) => {
          removeHashtagPromises.push(new Promise((resolve, reject) => {
            this.listingsService.removeHashtags(val).subscribe(
              (res) => {
                resolve();
              },
              (err) => {
                reject();
              }
            );
            })
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
                }
              );
          });
        });

        this.jobArr.forEach((val) => {
          if (val.job_id == null && val.title != "" && val.description != "") {
            this.listingsService.createListingJobs({
              listing_id: this.listingId,
              job_title: val.title,
                job_description: val.description,
              })
              .subscribe(
                (res) => {},
                (err) => {
                  console.log(err);
                }
              );
          } else if (val.job_id && val.title != "" && val.description != "") {
            this.listingsService
              .updateJobs(val.job_id, {
                job_title: val.title,
                job_description: val.description,
              })
              .subscribe(
                (res) => {},
                (err) => {
                  console.log(err);
                }
              );
          }
        });

        this.faqArr.forEach((val) => {
          if (val.faq_id == null && val.question != "" && val.answer != "") {
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
                }
              );
          } else if (val.faq_id && val.answer != "" && val.question != "") {
            this.listingsService
              .updateFAQ(val.faq_id, {
                question: val.question,
                answer: val.answer,
              })
              .subscribe(
                (res) => {},
                (err) => {
                  console.log(err);
                }
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
        this.snackbarService.openSnackBar(
          this.snackbarService.DialogList.update_listing.error,
          false
        );
        return;
      },

      () => {
        this.snackbarService.openSnackBar(
          this.snackbarService.DialogList.update_listing.success,
          true
        );
        this.router.navigate(["/listing/" + this.listingId]);
      }
    );
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
}
