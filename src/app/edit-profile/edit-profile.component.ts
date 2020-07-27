import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

import { Profile, DefaultProfile } from "../interfaces/profile";

@Component({
  selector: "app-edit-profile",
  templateUrl: "./edit-profile.component.html",
  styleUrls: ["./edit-profile.component.scss"],
})
export class EditProfileComponent implements OnInit {
  EditProfileForm: FormGroup;

  constructor(private fb: FormBuilder) {}
  ngOnInit() {
    this.EditProfileForm = this.fb.group({
      ...DefaultProfile,
    });
  }

  saveProfile() {
    console.log(this.EditProfileForm.value);
  }
}
