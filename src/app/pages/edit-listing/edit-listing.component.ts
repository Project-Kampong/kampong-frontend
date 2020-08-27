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
    private route: ActivatedRoute
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

  rawSkillsets = [];

  ngOnInit() {
    window.scroll(0, 0);
    this.listingId = this.route.snapshot.params["id"];
    this.ListingForm = this.fb.group({
      ...CreateListing,
      ...ListingStory,
      SkillsList: [],
    });

    // Grab Skillsets
    this.paginationSkillsets(1);

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
      }
    );
    this.ListingsService.getSelectedListingStories(this.listingId).subscribe(
      (data) => {
        console.log(data["data"]);
        this.ListingForm.patchValue(data["data"]);
      }
    );

    // Grab Milestone
    this.ListingsService.getSelectedListingMilestones(this.listingId).subscribe(
      (data) => {
        const milestonesData = data["data"];
        if (milestonesData.length == 0) {
          this.milestoneArr.push({ deadline: new Date(), milestone: "" });
        } else {
          milestonesData.map((x) => {
            this.milestoneArr.push({
              deadline: x.date,
              milestone: x.description,
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
    // Grab Skillsets
    this.ListingsService.getSelectedListingSkills(this.listingId).subscribe(
      (data) => {
        console.log(data);
        var skillsarr = [];
        this.SkillsetsCC = data["data"];
        data["data"].map((x) => {
          skillsarr.push(x.skill_id);
        });
        this.ListingForm.controls["SkillsList"].setValue(skillsarr);
        console.log(this.ListingForm.value);
      }
    );
  }
  SkillsetsCC = [];
  // Submit Data
  saveListing() {
    var routeTo;
    const listingData = this.ListingForm.value;
    console.log(listingData);
    var listingUpdates = new FormData();
    listingUpdates.append("title", listingData.title);
    listingUpdates.append("category", listingData.category);
    listingUpdates.append("tagline", listingData.tagline);
    listingUpdates.append("mission", listingData.mission);
    for (var i = 0; i < this.fileArr.length; i++) {
      listingUpdates.append("pic" + (i + 1), this.fileArr[i]);
    }

    // Update Main Listing
    this.ListingsService.updateListing(
      this.listingId,
      listingUpdates
    ).subscribe(
      (data) => {
        console.log(data);
        this.ListingsService.UpdateListingStory(this.listingId, {
          overview: listingData.overview,
          problem: listingData.problem,
          solution: listingData.solution,
          outcome: listingData.outcome,
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
          if (
            x.milestone_id == null &&
            x.milestone != "" &&
            x.deadline != null
          ) {
            this.ListingsService.createListingMilestones({
              listing_id: this.listingId,
              description: x.milestone,
              date: x.deadline,
            }).subscribe();
          } else if (
            x.milestone_id != null &&
            x.milestone != "" &&
            x.deadline != null
          ) {
            this.ListingsService.updateMilestone(x.milestone_id, {
              description: x.milestone,
              date: x.deadline,
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
        var createSkillsArr = [];
        listingData.SkillsList.map((x) => {
          var notexist = true;
          this.SkillsetsCC.map((y) => {
            if (x == y.skill_id) {
              notexist = false;
              y.exist = true;
              return;
            }
          });
          if (notexist == true) {
            createSkillsArr.push(x);
          }
        });
        this.SkillsetsCC.map((x) => {
          if (x.exist == null) {
            this.ListingsService.removeListingSkills(
              x.listing_skill_id
            ).subscribe();
          }
        });
        createSkillsArr.map((x) => {
          this.ListingsService.connectListingSkills({
            listing_id: this.listingId,
            skill_id: x,
          }).subscribe();
        });
      },
      (err) => {
        console.log(err);
        return;
      },
      () => {
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
  paginationSkillsets(pagenum) {
    this.ListingsService.getAllSkillsets(pagenum).subscribe((data) => {
      this.rawSkillsets.push(...data["data"]);
      // Check for More
      if (data["pagination"]["next"] != null) {
        this.paginationSkillsets(data["pagination"]["next"]["page"]);
      } else {
        // Sort Skills
        for (var i = 0; i < this.skillsets.length; i++) {
          this.rawSkillsets.map((x) => {
            if (x.skill_group == this.skillsets[i].name) {
              this.skillsets[i].group.push(x);
            }
          });
        }
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
    this.milestoneArr.push({ deadline: new Date(), milestone: "" });
    this.milestoneArr.sort((a, b) => {
      return <any>new Date(a.deadline) - <any>new Date(b.deadline);
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
      this.ListingsService.removeListing(this.listingId).subscribe((data) => {
        console.log(data);
        this.router.navigate(["/profile"]);
      });
    }
  }
}
