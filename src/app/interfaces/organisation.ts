import { FormControl, Validators } from "@angular/forms";

const ORG_VALIDATION_PATTERN = Validators.pattern(
  "^[a-zA-Z0-9 \n .,'()\"$#+%&-°*!']+$"
);

export interface Organisation {
  organisation_id: string;
  created_by: string;
  name: string;
  organisation_type: string;
  about: string;
  website_url: string;
  handphone: string;
  email: string;
}

export interface CreateOrganisation {
  name: string,
  organisation_type: string,
  about: string,
  website_url: string,
  phone: string,
  email: string,
  locations: string[],
  story: string,
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

export const CreateOrganisationForm = {

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
    Validators.required,
    Validators.maxLength(100)
  ]),

  handphone: new FormControl("", [
    Validators.required,
    Validators.maxLength(20), 
    ORG_VALIDATION_PATTERN
  ]),

  email: new FormControl("", [
    Validators.required, 
    Validators.email,
    Validators.maxLength(320),
  ]),

  locations: new FormControl([]),

  address: new FormControl("", [
    Validators.required,
  ]),

  story: new FormControl(""),

  customType: new FormControl("", [
    Validators.maxLength(25)
  ]),

};

export const DefaultOrganisation = {
  organisation_id: "default",
  created_by: "default",
  name: "default",
  organisation_type: "default",
  about: "default",
  website_url: "default",
  handphone: "default",
  email: "default"
};
