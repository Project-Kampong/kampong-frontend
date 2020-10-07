import { Component, OnInit } from "@angular/core";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import {
  FormGroup,
  FormBuilder,
  Validators,
  ValidationErrors,
} from "@angular/forms";
import { MatChipInputEvent } from "@angular/material/chips";

import { Router, ActivatedRoute } from "@angular/router";

import { ListingsService } from "@app/services/listings.service";
import { SnackbarService } from "@app/services/snackbar.service";
declare var $: any;

// Interface
import { Listing, CreateListing, ListingStory } from "@app/interfaces/listing";

@Component({
  selector: "app-edit-listing",
  templateUrl: "./edit-listing.component.html",
  styleUrls: ["./edit-listing.component.scss"],
})
export class EditListingComponent implements OnInit {
  listingId;
  selectedFile: File = null;
  ListingForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public ListingsService: ListingsService,
    private router: Router,
    private route: ActivatedRoute,
    public SnackbarService: SnackbarService
  ) {}

  fileDisplayArr = [];
  fileArr = [];
  fileLimit = false;
  fileCount = 0;

  milestoneArr = [];
  faqArr = [];
  categoryGroup = [
    {
      name: "Social",
      group: [
        "Health",
        "Marriage",
        "Education",
        "Mentorship",
        "Retirement",
        "Housing",
        "Rental Flats",
        "Family",
        "Gender",
        "Elderly",
        "Youth",
        "Youth At Risk",
        "Pre-School",
        "Race",
        "Language",
        "Science",
        "Art",
        "Sports",
        "Poverty",
        "Inequality",
      ],
    },
    {
      name: "Environment",
      group: ["Recycling", "Green", "Water", "Waste", "Food", "Growing"],
    },
    {
      name: "Economical",
      group: [
        "Finance",
        "Jobs",
        "Wage",
        "Upskill",
        "Technology",
        "IT",
        "IoT 4.0",
        "Information",
        "Automation",
        "Online",
        "Digitalization",
      ],
    },
    {
      name: "Others",
      group: ["Productivity", "Innovation", "Research", "Manpower", "Design"],
    },
    {
      name: "Customise",
      group: ["Create a Category"],
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
  lookingForArr = [];

  ngOnInit() {
    window.scroll(0, 0);

    this.listingId = this.route.snapshot.params["id"];
    this.ListingForm = this.fb.group({
      ...CreateListing,
      ...ListingStory,
      LocationsList: [],
      customCategory: ["", [Validators.maxLength(25)]],
    });

    // Grab Skillsets
    this.paginationSkillsets();
    this.ListingsService.getAllLocations().subscribe((data) => {
      console.log(data);
      this.locationList = data["data"];
    });

    // Grab data
    this.ListingsService.getSelectedListing(this.listingId).subscribe(
      (data) => {
        console.log(data["data"]);
        this.ListingForm.patchValue(data["data"]);
        // Handle Images
        for (var i = 1; i < 6; i++) {
          if (data["data"]["pic" + i] != null) {
            this.fileDisplayArr.push(data["data"]["pic" + i]);
            this.fileArr.push(data["data"]["pic" + i]);
            this.fileLimitChecker(true);
          } else {
            return;
          }
        }
        // Category Finder
        const currentCategory = data["data"].category;
        var categoryFound = false;
        this.categoryGroup.map((x) => {
          x.group.map((y) => {
            if (y == currentCategory) {
              categoryFound = true;
              return;
            }
          });
        });
        if (!categoryFound) {
          this.categoryGroup.map((x) => {
            if (x.name == "Customise") {
              x.group.push(currentCategory);
            }
          });
        }
      }
    );
    this.ListingsService.getSelectedListingStories(this.listingId).subscribe(
      (data) => {
        console.log(data["data"]);
        var tempData = data["data"];
        tempData.overview = data["data"].overview
          .replace(/&lt;/g, "<")
          .replace(/<a/g, "<a target='_blank'");
        $("#output").html(tempData.overview);
        this.ListingForm.patchValue(tempData);
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
        this.ListingForm.controls["LocationsList"].setValue(tempLocation);
        console.log(this.ListingForm.value.LocationsList);
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
    const listingData = this.ListingForm.value;
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

  // Handle file section
  uploadFile(event) {
    this.selectedFile = <File>event.target.files[0];

    // upload file
    var imageFd = new FormData();
    imageFd.append("file", this.selectedFile);
    this.ListingsService.uploadFile(imageFd).subscribe(
      (res) => {
        this.fileLimitChecker(true);
        this.fileDisplayArr.push(res["data"]);
        this.fileArr.push(res["data"]);
        console.log(this.fileArr);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  removeFile(file, i) {
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

  // End of Handle file section

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
    return error;
  }

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
    if (confirm("Are you sure to delete " + this.ListingForm.value.title)) {
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
