import { FormControl, Validators } from "@angular/forms";

const LISTING_VALIDATION_PATTERN = Validators.pattern(
  "^[a-zA-Z0-9 \n .,'()\"$#%&-°*!']+$"
);

const URL_VALIDATION_PATTERN = Validators.pattern(
  '((http|ftp|https):\\/\\/)?[\\w\\-_]+(\\.[\\w\\-_]+)+([\\w\\-\\.,@?^=%&amp;:/~\\+#]*[\\w\\-\\@?^=%&amp;/~\\+#])?'
);

export interface Listing {
  listing_id: string;
  organisation_id: string;
  created_by: string;
  title: string;
  category: string;
  about: string;
  tagline: string;
  mission: string;
  listing_url: string;
  pics: string[];
  listing_email: string;
}

export interface ListingFAQ {
  faq_id: string;
  listing_id: string;
  question: string;
  answer: string;
}

export interface ListingSkills {
  skill_id: string;
  listing_id: string;
  skill: string;
}

export interface ListingComments {
  listing_comment_id: string;
  listing_id: string;
  user_id: string;
  comment: string;
  reply_to_id: string;
  created_on: string;
  updated_on: string;
  nickname: string;
}

export interface ListingStories {
  outcome: string;
  overview: string;
  problem: string;
  solution: string;
}

export interface ListingHashtags {
  listing_id: string;
  tag: string;
}



export interface CreateListingMilestones {
  description: string;
  date: Date;
}

export interface CreateListingJobs {
  title: string;
  description: string;
}

export interface CreateListingFAQ {
  question: string;
  answer: string;
}

export interface CreateListing {
  title: string;
  category: string;
  tagline: string;
  mission: string;
  listing_url: string;
  listing_email: string;
  listing_status: string;
  pics: string[];
  locations: string[];
}

export interface EditListingHashtags {
  hashtag_id: number;
  tag: string;
}

export interface EditListingMilestones {
  milestone_id: number;
  description: string;
  date: Date;
}

export interface EditListingJobs {
  job_id: number;
  title: string;
  description: string;
}

export interface EditListingFAQ {
  faq_id: string;
  question: string;
  answer: string;
}

export interface EditListing {
  title: string;
  category: string;
  tagline: string;
  mission: string;
  listing_url: string;
  listing_email: string;
  listing_status: string;
  pics: string[];
  locations: string[];
}

export const CreateListingForm = {
  
  title: new FormControl("", [
    Validators.required,
    Validators.maxLength(50),
    LISTING_VALIDATION_PATTERN
  ]),

  category: new FormControl("", [
    Validators.required,
  ]),

  about: new FormControl(""),

  tagline: new FormControl("",[
    Validators.required,
    Validators.maxLength(100),
    LISTING_VALIDATION_PATTERN,
  ]),

  mission: new FormControl("", [
    Validators.required,
    Validators.maxLength(150),
    LISTING_VALIDATION_PATTERN
  ]),

  listing_email: new FormControl("", [
    Validators.required,
    Validators.email
  ]),

  listing_url: new FormControl("", [
    URL_VALIDATION_PATTERN,
  ]),

  locations: new FormControl([]),

};

export const EditListingForm = {
  
  title: new FormControl("", [
    Validators.required,
    Validators.maxLength(50),
    LISTING_VALIDATION_PATTERN
  ]),

  category: new FormControl("", [
    Validators.required,
  ]),

  about: new FormControl(""),

  tagline: new FormControl("",[
    Validators.required,
    Validators.maxLength(100),
    LISTING_VALIDATION_PATTERN,
  ]),

  mission: new FormControl("", [
    Validators.required,
    Validators.maxLength(150),
    LISTING_VALIDATION_PATTERN
  ]),

  listing_email: new FormControl("", [
    Validators.required,
    Validators.email
  ]),

  listing_url: new FormControl("", [
    URL_VALIDATION_PATTERN,
  ]),

  locations: new FormControl([]),

};

export const CreateListingStoryForm = {
  
  overview: new FormControl(""),

  problem: new FormControl(""),

  solution: new FormControl(""),

  outcome: new FormControl(""),
}

export const EditListingStoryForm = {
  
  overview: new FormControl(""),

  problem: new FormControl(""),

  solution: new FormControl(""),

  outcome: new FormControl(""),
}

export const DefaultListing = {
  listing_id: "default",
  organisation_id: "default",
  created_by: "default",
  title: "default",
  category: "default",
  about: "default",
  tagline: "default",
  mission: "default",
  listing_url: "default",
  pics: ["default"],
  listing_email: "default",
};

export interface OriginalImagesCheck {
  image: string;
  check: boolean;
}