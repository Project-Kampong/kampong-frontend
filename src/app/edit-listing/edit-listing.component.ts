import { Component, OnInit } from "@angular/core";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatChipInputEvent } from "@angular/material/chips";

import { Router, ActivatedRoute } from "@angular/router";

import { ListingsService } from "../services/listings.service";
declare var $: any;

// Interface
import { Listing, CreateListing, ListingStory } from "../interfaces/listing";

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
        "Technology ",
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
      group: [
        "Needs Analysis",
        "Quantitative Research",
        "Statistical Analysis",
        "Compiling Statistics",
        "Database Management",
        "Modeling",
        "Data Analytics",
      ],
    },
    {
      name: "Coding & Programming",
      group: ["Phone Applications", "Design UIUX", "Website Building"],
    },
    {
      name: "Project Management",
      group: [
        "Benchmarking",
        "Budget Planning",
        "Operations",
        "Quality Assurance",
        "Scheduling",
        "Fund Raiser",
        "Administrative",
        "Microsoft Office Skills",
        "Negotiations",
        "Public Speaking",
      ],
    },
    {
      name: "Social Media Experience",
      group: [
        "Content Management System",
        "Digital Marketing",
        "Networking",
        "Search Engine Optimisation",
        "Social Media Platforms",
        "Web Analytics",
        "Sales",
        "Automated Marketing Software",
        "Graphic Design",
      ],
    },
    {
      name: "Writing",
      group: [
        "Research",
        "Emails",
        "Client Relations",
        "Technical Documentation",
        "Requirements Gathering",
      ],
    },
  ];

  ngOnInit() {
    window.scroll(0, 0);
    this.listingId = this.route.snapshot.params["id"];
    this.ListingForm = this.fb.group({
      ...CreateListing,
      ...ListingStory,
      SkillsList: [],
    });

    // Grab data
    this.ListingsService.getSelectedListing(this.listingId).subscribe(
      (data) => {
        console.log(data["data"]);
        this.ListingForm.patchValue(data["data"]);
        // Handle Images
        for (var i = 1; i < 6; i++) {
          if (data["data"]["pic" + i] != null) {
            this.fileDisplayArr.push({
              file: data["data"]["pic" + i],
              index: "pic" + i,
            });
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
          this.milestoneArr.push({ deadline: "", milestone: "" });
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
  }

  removeFile(file, i) {
    console.log(file);
    // this.fileDisplayArr.splice(i, 1);
    // this.fileArr.splice(i, 1);
    // this.fileLimitChecker(false);
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

  createListing() {
    var routeTo;
    const listingData = this.ListingForm.value;
    var ImageFd = new FormData();
    ImageFd.append("title", listingData.title);
    ImageFd.append("category", listingData.category);
    ImageFd.append("tagline", listingData.tagline);
    ImageFd.append("mission", listingData.mission);
    ImageFd.append("listing_url", "www.test.com");

    for (var i = 0; i < this.fileArr.length; i++) {
      ImageFd.append("pic" + (i + 1), this.fileArr[i].name);
      ImageFd.append("pics", this.fileArr[i]);
    }
    console.log(ImageFd);
    this.ListingsService.createListing(ImageFd).subscribe(
      (res) => {
        console.log(res);
        const listing_id = res["data"][0]["listing_id"];
        routeTo = listing_id;
        console.log(listing_id);
        // Handle Stories
        this.ListingsService.UpdateListingStory(listing_id, {
          overview: listingData.overview,
          problem: listingData.problem,
          solution: listingData.solution,
          outcome: listingData.outcome,
        }).subscribe((data) => {
          console.log(data);
        });
        // Handle Milestones
        for (var i = 0; i < this.milestoneArr.length; i++) {
          this.ListingsService.createListingMilestones({
            listing_id: listing_id,
            description: this.milestoneArr[i].milestone,
            date: this.milestoneArr[i].deadline,
          }).subscribe((data) => {
            console.log(data);
          });
        }
        // Handle Hashtags
        for (var i = 0; i < this.hashtags.length; i++) {
          this.ListingsService.createListingHashtags({
            listing_id: listing_id,
            tag: this.hashtags[i],
          }).subscribe((data) => {
            console.log(data);
          });
        }
        // Handle Skills
        // for (var i = 0; i < listingData.SkillsList.length; i++) {
        //   console.log(listingData.SkillsList[i]);
        //   this.ListingsService.createListingSkills(
        //     listingData.SkillsList[i]
        //   ).subscribe((data) => {
        //     console.log(data);
        //     this.ListingsService.connectListingSkills({
        //       listing_id: listing_id,
        //       skill_id: data["data"].skill_id,
        //     });
        //   });
        // }

        // Handle FAQs
        for (var i = 0; i < this.faqArr.length; i++) {
          this.ListingsService.createListingFAQ({
            listing_id: listing_id,
            question: this.faqArr[i].questions,
            answer: this.faqArr[i].answer,
          }).subscribe((data) => {
            console.log(data);
          });
        }
      },
      (err) => {
        console.log(err);
        return;
      },
      () => {
        this.router.navigate(["/listing/" + routeTo]);
      }
    );
  }

  // Chips UI and Data
  visible = true;
  selectable = false;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  hashtags = [];
  hashtagsError = false;
  add(event: MatChipInputEvent): void {
    const value = "#" + event.value.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, "");
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
      this.ListingsService.removeHashtags(data.hashtag_id).subscribe();
      if (this.hashtags.length == 3) {
        this.hashtagsError = true;
      } else {
        this.hashtagsError = false;
      }
    }
  }

  // Milestones and FAQ UI
  addMilestone() {
    this.milestoneArr.push({ deadline: "", milestone: "" });
    this.milestoneArr.sort((a, b) => {
      return <any>new Date(a.deadline) - <any>new Date(b.deadline);
    });
  }
  removeMilestone(milestone, i) {
    this.milestoneArr.splice(i, 1);
    // Delete Milestone
    if (milestone.milestone_id != null) {
      this.ListingsService.removeMilestone(milestone.milestone_id).subscribe();
    }
  }

  addFAQ() {
    this.faqArr.push({ questions: "", answer: "" });
  }
  removeFAQ(faq, i) {
    this.faqArr.splice(i, 1);
    // Delete FAQ
    if (faq.faq_id != null) {
      this.ListingsService.removeFAQ(faq.faq_id).subscribe();
    }
  }

  // Remove Listing
  removeListing() {
    if (confirm("Are you sure to delete " + this.ListingForm.value.title)) {
      this.ListingsService.removeListing(this.listingId).subscribe((data) => {
        console.log(data);
      });
    }
  }
}
