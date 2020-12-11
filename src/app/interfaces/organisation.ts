import { FormControl, Validators } from "@angular/forms";

const ORG_VALIDATION_PATTERN = Validators.pattern(
  "^[a-zA-Z0-9 \n .,'()\"$#+%&-°*!']+$"
);

export interface Organisation {
  organisation_id: string;
  name: string;
  organisation_type: string;
  about: string;
  website_url: string;
  phone: string;
  email: string;
  address: string;
  owned_by: string;
  locations: string[];
  story: string,
  facebook_link: string,
  twitter_link: string,
  instagram_link: string,
  banner_photo: string,
  profile_photo: string,
  additional_photos: string[],
  is_verified: boolean,
  created_on: string,
  deleted_on: string,
}

export interface OrganisationBanner {
  banner_photo: string,
  profile_photo: string,
  name: string,
  about: string,
  address: string,
  facebook_link: string,
  instagram_link: string,
  twitter_link: string,
  website_url: string,
}

export interface CreateOrganisation {
  name: string,
  organisation_type: string,
  about: string,
  website_url?: string,
  phone?: string,
  email: string,
  story?: string,
  address?: string,
  locations?: string[],
  facebook_link?: string,
  twitter_link?: string,
  instagram_link?: string,
}

export interface Programmes {
  organisation_id : string,
  title: string,
  about: string,
  media_url: string[],
}

export interface CreateProgrammes {
  title: string,
  about: string,
  media_url: string[],
}

export const createOrganisationForm = {

  name: new FormControl("", [
    Validators.required, 
    Validators.maxLength(50), 
    ORG_VALIDATION_PATTERN
  ]),

  organisation_type: new FormControl("", [
    Validators.required, 
    Validators.maxLength(25)
  ]),

  about: new FormControl("", [
    Validators.required, 
    Validators.maxLength(500)
  ]),

  website_url: new FormControl("", [
    Validators.maxLength(100)
  ]),

  phone: new FormControl("", [  
    Validators.maxLength(20), 
    ORG_VALIDATION_PATTERN
  ]),

  email: new FormControl("", [
    Validators.email,
    Validators.maxLength(320),
    Validators.required,
  ]),

  locations: new FormControl([]),

  address: new FormControl(""),

  story: new FormControl(""),

  facebook_link: new FormControl(""),

  twitter_link: new FormControl(""),

  instagram_link: new FormControl(""),

};

export const defaultOrganisation = {
  organisation_id: "default",
  created_by: "default",
  name: "default",
  organisation_type: "default",
  about: "default",
  website_url: "default",
  handphone: "default",
  email: "default"
};
