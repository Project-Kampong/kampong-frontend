import { Validators } from "@angular/forms";

export interface Organisation {
  organisation_id: String;
  created_by: String;
  name: String;
  type: String;
  about: String;
  website_url: String;
  handphone: String;
  email: String;
}

// Validation
const patternValidation = Validators.pattern(
  "^[a-zA-Z0-9 \n .,'()\"$#%&-°*!']+$"
);
export const CreateOrganisation = {
  name: [
    "",
    [Validators.required, Validators.maxLength(50), patternValidation],
  ],
  type: ["", [Validators.required, Validators.maxLength(25)]],
  about: ["", [Validators.required, Validators.maxLength(500)]],
  website_url: ["", [Validators.required, Validators.maxLength(100)]],
  handphone: [0, [Validators.required, Validators.max(100000000), patternValidation]], //need better ones
  email: ["", [Validators.required, Validators.email]],
};

export const DefaultOrganisation = {
  organisation_id: "default",
  created_by: "default",
  name: "default",
  type: "default",
  about: "default",
  website_url: "default",
  handphone: "default",
  email: "default"
};
