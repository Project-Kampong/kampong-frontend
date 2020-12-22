import { FormControl, Validators } from "@angular/forms";

const ORG_VALIDATION_PATTERN = Validators.pattern(
  "^[a-zA-Z0-9 \n .,'()\"$#+%&-°*!']+$"
);

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