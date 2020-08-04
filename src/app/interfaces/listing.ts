export interface Listing {
  listing_id: String;
  organisation_id: Number;
  created_by: String;
  title: String;
  category: String;
  about: String;
  tagline: String;
  mission: String;
  listing_url: String;
  pic1: String;
  pic2: String;
  pic3: String;
  pic4: String;
  pic5: String;
}

export interface ListingFAQ {
  faq_id: String;
  listing_id: String;
  question: String;
  answer: String;
}

export interface ListingSkills {
  skill_id: String;
  listing_id: String;
  skill: String;
}

export const DefaultListing = {
  UserID: "UserID",
  FirstName: "Bruce",
  LastName: "Wayne",
  DateOfBirth: new Date(
    "Tue May 01 1990 00:00:00 GMT+0800 (Singapore Standard Time)"
  ),
  Occupation: "Student",
  AboutMe:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
};
