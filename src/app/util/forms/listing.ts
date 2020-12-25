import { FormControl, Validators } from "@angular/forms";

const LISTING_VALIDATION_PATTERN = Validators.pattern(
  "^[a-zA-Z0-9 \n .,'()\"$#%&-°*!']+$"
);

const URL_VALIDATION_PATTERN = Validators.pattern(
  '((http|ftp|https):\\/\\/)?[\\w\\-_]+(\\.[\\w\\-_]+)+([\\w\\-\\.,@?^=%&amp;:/~\\+#]*[\\w\\-\\@?^=%&amp;/~\\+#])?'
);

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
  
  }