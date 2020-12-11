// Angular Imports
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, ValidationErrors } from "@angular/forms";
import { Router } from "@angular/router";

// Services
import { OrganisationsService } from "@app/services/organisations.service";
import { SnackbarService } from "@app/services/snackbar.service"

// Util
import { categoryListCustom } from "@app/util/categories";
import { locationList } from '@app/util/locations';

// Interfaces
import { createOrganisationForm, CreateOrganisation, CreateProgrammes, Programmes } from "@app/interfaces/organisation";
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
  organisationId: string;
  headerPhoto: File;
  headerPhotoDisplay: string;
  displayPhoto: File;
  displayPhotoDisplay: string;
  additionalPhotos: File[];
  additionalPhotosDisplay: string[];
  pgArr: Array<CreateProgrammes>;
  programmePhotos: File[][];
  programmePhotosDisplay: string[][];
  mediaArr: string[][];


  constructor(
    private fb: FormBuilder,
    public organisationsService: OrganisationsService,
    private router: Router,
    public snackbarService: SnackbarService,
  ) {}

  ngOnInit() {

    //initialize variables
    this.typeGroup = categoryListCustom;
    this.locationGroup = locationList;
    this.organisationForm = this.fb.group(createOrganisationForm);
    this.organisationData = null;
    this.organisationId = "";
    this.headerPhoto = null;
    this.headerPhotoDisplay = "";
    this.displayPhoto = null;
    this.displayPhotoDisplay = "";
    this.additionalPhotos = [];
    this.additionalPhotosDisplay = [];
    this.pgArr = [];
    this.programmePhotos = [];
    this.programmePhotosDisplay = [];

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

  uploadHeaderPhoto(event: Event): void {
    const reader: FileReader = new FileReader();
    reader.onload = (e) => {
      this.headerPhotoDisplay = reader.result.toString();
    }
    try {
      reader.readAsDataURL((event.target as HTMLInputElement).files[0]);
    } catch (error) {
      console.log(error);
      return;
    }
    this.headerPhoto = <File>(event.target as HTMLInputElement).files[0];
  }

  removeHeaderPhoto(): void {
    this.headerPhoto = null;
    this.headerPhotoDisplay = "";
  }

  uploadDisplayPhoto(event: Event): void {
    const reader: FileReader = new FileReader();
    reader.onload = (e) => {
      this.displayPhotoDisplay = reader.result.toString();
    }
    try {
      reader.readAsDataURL((event.target as HTMLInputElement).files[0]);
    } catch (error) {
      console.log(error);
      return;
    }
    this.displayPhoto = <File>(event.target as HTMLInputElement).files[0];
  }

  removeDisplayPhoto(): void {
    this.displayPhoto = null;
    this.displayPhotoDisplay = "";
  }

  uploadAdditionalPhoto(event: Event): void {
    if (this.additionalPhotos.length === 5 && this.additionalPhotosDisplay.length === 5) {
      return;
    }
    const reader: FileReader = new FileReader();
    reader.onload = (e) => {
      this.additionalPhotosDisplay.push(reader.result.toString());
    }
    try {
      reader.readAsDataURL((event.target as HTMLInputElement).files[0]);
    } catch (error) {
      console.log(error);
      return;
    }
    this.additionalPhotos.push(<File>(event.target as HTMLInputElement).files[0]);
  }

  removeAdditionalPhoto(i: number): void {
    this.additionalPhotos.splice(i, 1);
    this.additionalPhotosDisplay.splice(i, 1);
  }

  addPg(): void {
    const blankProgramme: CreateProgrammes = {
      title: "",
      about: "",
      media_url: [],
    }
    this.pgArr.push(blankProgramme);
    this.programmePhotos.push([]);
    this.programmePhotosDisplay.push([]);
  }

  removePg(i): void {
    this.pgArr.splice(i, 1);
    this.programmePhotos.splice(i, 1);
    this.programmePhotosDisplay.splice(i, 1);
  }

  uploadProgrammePhoto(event: Event, idx: number): void {
    if (this.programmePhotos[idx].length === 5 && this.programmePhotosDisplay[idx].length === 5) {
      return;
    }
    const reader: FileReader = new FileReader();
    reader.onload = (e) => {
      this.programmePhotosDisplay[idx].push(reader.result.toString());
    }
    try {
      reader.readAsDataURL((event.target as HTMLInputElement).files[0]);
    } catch (error) {
      console.log(error);
      return;
    }
    this.programmePhotos[idx].push(<File>(event.target as HTMLInputElement).files[0]);
  }

  removeProgrammePhoto(i: number, idx: number): void {
    this.programmePhotos[idx].splice(i, 1);
    this.programmePhotosDisplay[idx].splice(i,1);
  }

  createOrganisation(): void {
    if (this.getFormValidationErrors()) {
      this.snackbarService.openSnackBar("Please complete the form", false);
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
    const story: string = $("#output").html();

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

    this.organisationsService.createOrganisation(this.organisationData).subscribe(
      (res) => {
        this.organisationId = res["data"]["organisation_id"];
        this.pgArr.forEach(pg => {

          const organisation_id = this.organisationId;
          const title: string = pg.title;
          const about: string = pg.about;
          const media_url: string[] = pg.media_url;

          const pgData: Programmes = {
            organisation_id,
            title,
            about,
            media_url
          }

          this.organisationsService.createProgrammes(pgData).subscribe(
            (res) => {},
            (err) => {
              console.log(err);
              this.snackbarService.openSnackBar(
                this.snackbarService.DialogList.create_programme.error,
                false
              );
            }
          )

        });
      },
      (err) => {
        console.log(err);
        this.snackbarService.openSnackBar(
          this.snackbarService.DialogList.create_organisation.error,
          false
        );
      },
      () => {
        this.snackbarService.openSnackBar(
          this.snackbarService.DialogList.create_organisation.success,
          true
        );
        this.organisationForm.reset();
        this.router.navigate(["/organisation/" + this.organisationId])
      } 
    )

  }

}
