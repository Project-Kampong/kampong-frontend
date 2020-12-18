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
  outcome: string;
  overview: string;
  problem: string;
  solution: string;
  listing_url: string;
  pics: string[];
  listing_email: string;
}

export interface ListingIndividual {
  about: string;
  category: string;
  created_by: string;
  created_on: string;
  deleted_on: string;
  end_date: string;
  is_featured: boolean;
  is_published: boolean;
  is_verified: boolean;
  keyword_vector: string;
  listing_email: string;
  listing_id: string;
  listing_status: string;
  listing_url: string;
  locations: string[];
  location_ids: number[];
  mission: string;
  nickname: string;
  outcome: string;
  overview: string;
  pics: string[];
  problem: string;
  profile_picture: string;
  solution: string;
  start_date: string;
  tagline: string;
  title: string;
  updated_on: string;
}

export interface ListingLikes {
  like_id: string;
  user_id: string;
}

export interface ListingFAQ {
  question: string;
  answer: string;
}

export interface ListingJobs {
  job_title: string,
  job_description: string,
}

export interface ListingUpdates {
  listing_update_id: string;
  pics: string[];
  created_on: string;
  updated_on: string;
  description: string;
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
  deleted_on: string,
  nickname: string;
  profile_picture: string;
  replies?: ListingComments[];
}

export interface ListingMilestones {
  date: string;
  milestone_description: string;
}

export interface ListingHashtags {
  listing_id: string;
  tag: string;
}

export interface CreateListingHashtags {
  listing_id: string;
  tag: string;
}

export interface CreateListingMilestones {
  listing_id: string;
  milestone_description: string;
  date: Date;
}

export interface CreateListingJobs {
  listing_id: string;
  job_title: string;
  job_description: string;
}

export interface CreateListingComments {
  listing_id: string;
  comment: string;
}

export interface CreateListingLocation {
  listing_id: string;
  location_id: number;
}

export interface CreateListingFAQ {
  listing_id: string;
  question: string;
  answer: string;
}

export interface CreateListingUpdates {
  listing_id: string;
  description: string;
  pics ?: string[];
}

export interface CreateListing {
  title: string;
  category: string;
  tagline: string;
  mission: string;
  outcome: string;
  overview: string;
  problem: string;
  solution: string;
  listing_url: string;
  listing_email: string;
  listing_status: string;
  pics?: string[];
  locations: string[];
}

export interface UpdateListingHashtags {
  hashtag_id: number;
  tag: string;
}

export interface UpdateListingMilestones {
  milestone_description: string;
  date: Date;
}

export interface UpdateListingJobs {
  job_id: number;
  job_title: string;
  job_description: string;
}

export interface UpdateListingFAQ {
  question: string;
  answer: string;
}

export interface UpdateListing {
  title: string;
  category: string;
  tagline: string;
  mission: string;
  outcome: string;
  overview: string;
  problem: string;
  solution: string;
  listing_url: string;
  listing_email: string;
  listing_status: string;
  pics?: string[];
  locations: string[];
}

export const createListingForm = {
  
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

  overview: new FormControl(""),

  problem: new FormControl(""),

  solution: new FormControl(""),

  outcome: new FormControl(""),

  listing_email: new FormControl("", [
    Validators.required,
    Validators.email
  ]),

  listing_url: new FormControl("", [
    URL_VALIDATION_PATTERN,
  ]),

  locations: new FormControl([]),

};

export const editListingForm = {
  
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

  overview: new FormControl(""),

  problem: new FormControl(""),

  solution: new FormControl(""),

  outcome: new FormControl(""),

  listing_email: new FormControl("", [
    Validators.required,
    Validators.email
  ]),

  listing_url: new FormControl("", [
    URL_VALIDATION_PATTERN,
  ]),

  locations: new FormControl([]),

};

export const defaultListing = {
  listing_id: "default",
  organisation_id: "default",
  created_by: "default",
  title: "default",
  category: "default",
  about: "default",
  tagline: "default",
  mission: "default",
  overview: "default",
  problem: "default",
  solution: "default",
  outcome: "default",
  listing_url: "default",
  pics: ["default"],
  listing_email: "default",
};

export interface originalImagesCheck {
  image: string;
  check: boolean;
}