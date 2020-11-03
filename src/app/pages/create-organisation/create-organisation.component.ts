import { Component, OnInit } from "@angular/core";
import { COMMA, ENTER, SPACE } from "@angular/cdk/keycodes";
import {
  FormGroup,
  FormBuilder,
  Validators,
  ValidationErrors,
} from "@angular/forms";
import { MatChipInputEvent } from "@angular/material/chips";

import { Router } from "@angular/router";

import { OrganisationsService } from "@app/services/organisations.service";
import { SnackbarService } from "@app/services/snackbar.service";
import { AuthService } from "@app/services/auth.service";
declare var $: any;

// Interface
import { Organisation, CreateOrganisation } from "@app/interfaces/organisation";

@Component({
  selector: "app-create-organisation",
  templateUrl: "./create-organisation.component.html",
  styleUrls: ["./create-organisation.component.scss"],
})
export class CreateOrganisationComponent implements OnInit {
  OrganisationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public OrganisationsService: OrganisationsService,
    private router: Router,
    public SnackbarService: SnackbarService,
    private AuthService: AuthService
  ) {}

  typeGroup = [
    {
      name: "Social",
      group: [
        "Health",
        "Marriage",
        "Education",
        "Mentorship",
        "Retirement",
        "Housing",
        "Rental Flats",
        "Family",
        "Gender",
        "Elderly",
        "Youth",
        "Youth At Risk",
        "Pre-School",
        "Race",
        "Language",
        "Science",
        "Art",
        "Sports",
        "Poverty",
        "Inequality",
      ],
    },
    {
      name: "Environment",
      group: ["Recycling", "Green", "Water", "Waste", "Food", "Growing"],
    },
    {
      name: "Economical",
      group: [
        "Finance",
        "Jobs",
        "Wage",
        "Upskill",
        "Technology ",
        "IT",
        "IoT 4.0",
        "Information",
        "Automation",
        "Online",
        "Digitalization",
      ],
    },
    {
      name: "Others",
      group: ["Productivity", "Innovation", "Research", "Manpower", "Design"],
    },
    {
      name: "Customise",
      group: ["Create a Type"],
    },
  ];

  ngOnInit() {
    this.OrganisationForm = this.fb.group({
      ...CreateOrganisation,
      customType: ["", [Validators.maxLength(25)]],
    });
    console.log(this.OrganisationForm);

    // CMS
    $(".action-container .action-btn").on("click", function () {
      let cmd = $(this).data("command");
      console.log(cmd);
      if (cmd == "createlink") {
        let url = prompt("Enter the link here: ", "https://");
        document.execCommand(cmd, false, url);
      } else if (cmd == "formatBlock") {
        let size = $(this).data("size");
        document.execCommand(cmd, false, size);
      } else {
        document.execCommand(cmd, false, null);
      }
    });
  }

  getFormValidationErrors() {
    var error = false;
    Object.keys(this.OrganisationForm.controls).forEach((key) => {
      const controlErrors: ValidationErrors = this.OrganisationForm.get(key).errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach((keyError) => {
          error = true;
        });
      }
    });
    if (
      this.OrganisationForm.value.type == "Create a Type" &&
      this.OrganisationForm.value.customType == ""
    ) {
      error = true;
    }
    return error;
  }

  createOrganisation() {
    if (this.getFormValidationErrors() == true) {
      this.SnackbarService.openSnackBar("Please complete the form", false);
      return;
    }
    var routeTo;
    const organisationData = this.OrganisationForm.value;
    var formdata = new FormData();
    //LOOK HERE!!
    formdata.append("name", organisationData.name);

    if (organisationData.type == "Create a Type") {
      formdata.append("type", organisationData.customType);
    } else {
      formdata.append("type", organisationData.type);
    }
    formdata.append("about", organisationData.about);
    formdata.append("website_url", "www.test.com");
    formdata.append("handphone", organisationData.handphone);
    formdata.append("email", organisationData.organisation_email);
    this.OrganisationsService.createOrganisation(formdata).subscribe(
      (res) => {
        console.log(res);
        const organisation_id = res["data"][0]["organisation_id"];
        routeTo = organisation_id;
        console.log(organisation_id);
      })
  }

  // Chips UI and Data
  visible = true;
  selectable = false;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA, SPACE];
  hashtags = [];
  hashtagsError = false;
  add(event: MatChipInputEvent): void {
    const value =
      "#" + event.value.replace(/[&\/\\#,+()$~%. '":*?<>\[\]{}]/g, "");
    if (this.hashtags.length == 3) {
      this.hashtagsError = true;
    } else if (value != "#") {
      this.hashtagsError = false;
      const input = event.input;
      console.log(value);
      if ((value || "").trim()) {
        this.hashtags.push(value.trim());
      }
      if (input) {
        input.value = "";
      }
    }
  }
}
