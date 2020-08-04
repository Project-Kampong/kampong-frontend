export interface Profile {
  nickname: String;
  FirstName: String;
  LastName: String;
  dob: Date;
  interest: String;
  about: String;
}

export const DefaultProfile = {
  nickname: "Batman",
  dob: new Date("Tue May 01 1990 00:00:00 GMT+0800 (Singapore Standard Time)"),
  interest: "Student",
  about:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
};
