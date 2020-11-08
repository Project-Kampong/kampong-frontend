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
import { categoryListCustom } from "@app/util/categories";
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

  typeGroup = categoryListCustom;

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
    var formdata = { 
      ...CreateOrganisation
    }
    //LOOK HERE!!
    formdata.name = organisationData.name

    if (organisationData.type == "Create a Type") {
      formdata.type = organisationData.customType;
    } else {
      formdata.type = organisationData.type;
    }
    formdata.about = organisationData.about;
    formdata.website_url = organisationData.website_url;
    formdata.handphone = organisationData.handphone;
    formdata.email = organisationData.email;
    this.OrganisationsService.createOrganisation(formdata).subscribe(
      (res) => {
        console.log(res);
        const organisation_id = res["data"]["organisation_id"];
        routeTo = organisation_id;
        console.log(organisation_id);
      }, (err) => { 
        console.log(err);
      }, () => {
        this.SnackbarService.openSnackBar(
          this.SnackbarService.DialogList.create_organisation.success,
          true
        );
        this.router.navigate(["/organisation/" + routeTo]);
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
