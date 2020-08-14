import { Component, OnInit } from "@angular/core";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatChipInputEvent } from "@angular/material/chips";

import { Router } from "@angular/router";

import { ListingsService } from "../services/listings.service";
declare var $: any;

// Interface
import { Listing, CreateListing, ListingStory } from "../interfaces/listing";

@Component({
  selector: "app-create-listing",
  templateUrl: "./create-listing.component.html",
  styleUrls: ["./create-listing.component.scss"],
})
export class CreateListingComponent implements OnInit {
  selectedFile: File = null;
  ListingForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public ListingsService: ListingsService,
    private router: Router
  ) {}

  fileDisplayArr = [];
  fileArr = [];
  fileLimit = false;
  fileCount = 0;

  milestoneArr = [{ milestone: "title", deadline: new Date("11/11/2020") }];
  faqArr = [{ questions: "", answer: "" }];
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
    this.ListingForm = this.fb.group({
      ...CreateListing,
      ...ListingStory,
      SkillsList: [],
    });
  }

  uploadFile(event) {
    this.selectedFile = <File>event.target.files[0];
    // this.fileArr.push(this.selectedFile);

    // Display Image
    var reader: FileReader = new FileReader();
    reader.onload = (e) => {
      this.fileDisplayArr.push(reader.result.toString());
    };
    reader.readAsDataURL(event.target.files[0]);
    this.fileLimitChecker(true);
    this.fileArr.push(this.selectedFile);
    console.log(this.fileArr);
    // Upload to S3
    // const fd = new FormData();
    // fd.append("file", this.selectedFile);
    // this.ListingsService.uploadFile(fd).subscribe(
    //   (res) => {
    //     console.log(res);
    //     // Display Image
    //     var reader: FileReader = new FileReader();
    //     reader.onload = (e) => {
    //       this.fileDisplayArr.push(reader.result.toString());
    //     };
    //     reader.readAsDataURL(event.target.files[0]);
    //     this.fileLimitChecker(true);
    //     this.fileArr.push(res["data"]);
    //   },
    //   (err) => {
    //     console.log(err);
    //     return;
    //   }
    // );
  }

  removeFile(i) {
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
  hashtags = ["hashtag1", "hashtag2", "hashtag3"];
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

      if (this.hashtags.length == 3) {
        this.hashtagsError = true;
      } else {
        this.hashtagsError = false;
      }
    }
  }

  // Milestones and FAQ UI
  addMilestone() {
    this.milestoneArr.push({ milestone: "", deadline: new Date() });
    console.log(this.milestoneArr);
    this.milestoneArr.sort((a, b) => {
      return <any>new Date(a.deadline) - <any>new Date(b.deadline);
    });
  }
  removeMilestone(i) {
    console.log(i);
    this.milestoneArr.splice(i, 1);
  }

  addFAQ() {
    this.faqArr.push({ questions: "", answer: "" });
  }
  removeFAQ(i) {
    this.faqArr.splice(i, 1);
  }
}
