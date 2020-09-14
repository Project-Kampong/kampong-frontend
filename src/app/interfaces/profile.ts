import { Validators } from "@angular/forms";

export interface Profile {
  nickname: String;
  FirstName: String;
  LastName: String;
  dob: Date;
  interest: String;
  about: String;
  profile_picture: String;
  occupation: String;
}

// Validation
const patternvalidation = Validators.pattern("^[a-zA-Z0-9 \n .,'()\"$#%&-]+$");
export const DefaultProfile = {
  nickname: [
    "",
    [Validators.required, Validators.maxLength(15), patternvalidation],
  ],
  dob: [new Date(), [Validators.required]],
  interest: [
    "Explorer",
    [Validators.required, Validators.maxLength(30), patternvalidation],
  ],
  occupation: [
    "Explorer",
    [Validators.required, Validators.maxLength(30), patternvalidation],
  ],
  about: [
    "",
    [Validators.required, Validators.maxLength(1000), patternvalidation],
  ],
  profile_picture:
    "https://images.pexels.com/photos/5089163/pexels-photo-5089163.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
};
