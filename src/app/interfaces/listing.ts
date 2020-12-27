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
  listing_title: string;
  updated_on: string;
}

export interface ListingLikes {
  like_id: number;
  user_id: string;
}

export interface ListingFAQ {
  question: string;
  answer: string;
}

export interface ListingJobs {
  job_title: string;
  job_description: string;
}

export interface ListingUpdates {
  listing_update_id: number;
  pics: string[];
  created_on: string;
  updated_on: string;
  description: string;
}

export interface ListingSkills {
  skill_id: number;
  listing_id: string;
  skill: string;
}

export interface ListingComments {
  listing_comment_id: number;
  listing_id: string;
  user_id: string;
  comment: string;
  reply_to_id: number;
  created_on: string;
  updated_on: string;
  deleted_on: string;
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
  reply_to_id?: number;
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
  pics?: string[];
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

export interface EditListingHashtags {
  hashtag_id: number;
  tag: string;
}

export interface EditListingMilestones {
  milestone_id: number;
  milestone_description: string;
  date: Date;
}

export interface EditListingJobs {
  job_id: number;
  job_title: string;
  job_description: string;
}

export interface EditListingFAQ {
  faq_id: number;
  question: string;
  answer: string;
}

export interface EditListing {
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

export interface originalImagesCheck {
  image: string;
  check: boolean;
}
