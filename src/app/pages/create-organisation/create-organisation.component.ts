import { Component, OnInit } from "@angular/core";
import { COMMA, ENTER, SPACE } from "@angular/cdk/keycodes";
import { FormGroup, FormBuilder, ValidationErrors } from "@angular/forms";

import { MatChipInputEvent } from "@angular/material/chips";

import { Router } from "@angular/router";

import { OrganisationsService } from "@app/services/organisations.service";
import { SnackbarService } from "@app/services/snackbar.service"
import { categoryListCustom } from "@app/util/categories";
import { locationList } from '@app/util/locations';

// Interface
import { CreateOrganisationForm, CreateOrganisation } from "@app/interfaces/organisation";
import { CategoryFilter, LocationFilter } from '@app/interfaces/filters';

declare var $: any;

@Component({
  selector: "app-create-organisation",
  templateUrl: "./create-organisation.component.html",
  styleUrls: ["./create-organisation.component.scss"],
})

export class CreateOrganisationComponent implements OnInit {
  
  typeGroup: Array<CategoryFilter>;
  locationGroup: Array<LocationFilter>;
  organisationForm: FormGroup;
  organisationData: CreateOrganisation;
  organisation_id: string;

  constructor(
    private fb: FormBuilder,
    public OrganisationsService: OrganisationsService,
    private router: Router,
    public SnackbarService: SnackbarService,
  ) {}

  ngOnInit() {

    this.typeGroup = categoryListCustom;
    this.locationGroup = locationList;
    this.organisationForm = this.fb.group(CreateOrganisationForm);
    this.organisationData = null;

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

  getFormValidationErrors(): boolean {

    Object.keys(this.organisationForm.controls).forEach((key) => {
      const controlErrors: ValidationErrors = this.organisationForm.get(key).errors;
      if (controlErrors != null) {
        return true;
      }
    });

    if (
      this.organisationForm.value.organisation_type == "Create a Category" &&
      this.organisationForm.value.customType == ""
    ) {
      return true;
    }
    return false;
  }

  createOrganisation(): void {
    if (this.getFormValidationErrors()) {
      this.SnackbarService.openSnackBar("Please complete the form", false);
      return;
    }

    const name: string = this.organisationForm.value.name;
    const organisation_type: string = this.organisationForm.value.organisation_type === "Create a Category" 
      ? this.organisationForm.value.customType
      : this.organisationForm.value.organisation_type;
    const about: string = this.organisationForm.value.about;
    const website_url: string = this.organisationForm.value.website_url;
    const phone: string = this.organisationForm.value.handphone;
    const email: string = this.organisationForm.value.email;
    const locations: string[] = this.organisationForm.value.locations;
    const story: string = this.organisationForm.value.story;

    this.organisationData = {
      name,
      organisation_type,
      about,
      website_url,
      phone,
      email,
      locations,
      story
    };

    this.OrganisationsService.createOrganisation(this.organisationData).subscribe(
      (res) => {
        this.organisation_id = res["data"]["organisation_id"];
      },
      (err) => {
        console.log(err);
        this.SnackbarService.openSnackBar(
          this.SnackbarService.DialogList.create_organisation.error,
          false
        );
      },
      () => {
        this.SnackbarService.openSnackBar(
          this.SnackbarService.DialogList.create_organisation.success,
          true
        );
        this.organisationForm.reset();
        this.router.navigate(["/organisation/" + this.organisation_id])
      } 
    )

  }

  /*
  createOrganisation() {
    if (this.getFormValidationErrors() == true) {
      this.SnackbarService.openSnackBar("Please complete the form", false);
      return;
    }

    var routeTo;
    const organisationData = this.organisationForm.value;
    var formdata = { 
      ...CreateOrganisationForm
    }
    //LOOK HERE!!
    formdata.name = organisationData.name

    if (organisationData.organisation_type == "Create a Type") {
      formdata.organisation_type = organisationData.customType;
    } else {
      formdata.organisation_type = organisationData.organisation_type;
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
  */
}
