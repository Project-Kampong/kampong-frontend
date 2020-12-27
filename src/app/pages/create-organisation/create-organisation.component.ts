// Angular Imports
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';

// Services
import { OrganisationsService } from '@app/services/organisations.service';
import { SnackbarService } from '@app/services/snackbar.service';

// Interfaces
import { CreateOrganisation } from '@app/interfaces/organisation';
import { createOrganisationForm } from '@app/util/forms/organisation';
import { Subscription } from 'rxjs';
import { AuthService } from '@app/services/auth.service';

import { categoriesStore } from '@app/store/categories-store';
import { locationsStore } from '@app/store/locations-store';

declare var $: any;

@Component({
  selector: 'app-create-organisation',
  templateUrl: './create-organisation.component.html',
  styleUrls: ['./create-organisation.component.scss'],
})
export class CreateOrganisationComponent implements OnInit, OnDestroy {
  organisationForm: FormGroup;
  organisationData: CreateOrganisation = null;
  organisationId: string = '';
  categoryGroup = categoriesStore;
  locationGroup = locationsStore;
  subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private organisationsService: OrganisationsService,
    private router: Router,
    private snackbarService: SnackbarService,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.organisationForm = this.fb.group(createOrganisationForm);
  }

  getFormValidationErrors(): boolean {
    Object.keys(this.organisationForm.controls).forEach((key) => {
      const controlErrors: ValidationErrors = this.organisationForm.get(key).errors;
      if (controlErrors != null) {
        return true;
      }
    });
    return false;
  }

  createOrganisation(): void {
    if (this.getFormValidationErrors()) {
      this.snackbarService.openSnackBar('Please complete the form', false);
      return;
    }
    const name: string = this.organisationForm.value.name;
    const organisation_type: string = this.organisationForm.value.organisation_type;
    const about: string = this.organisationForm.value.about;
    const website_url: string = this.organisationForm.value.website_url;
    const phone: string = this.organisationForm.value.handphone;
    const email: string = this.organisationForm.value.email;
    const locations: string[] = this.organisationForm.value.locations;
    const address: string = this.organisationForm.value.address;
    const facebook_link: string = this.organisationForm.value.facebook_link;
    const twitter_link: string = this.organisationForm.value.twitter_link;
    const instagram_link: string = this.organisationForm.value.instagram_link;

    this.organisationData = {
      name,
      organisation_type,
      about,
      website_url,
      phone,
      email,
      locations,
      address,
      facebook_link,
      twitter_link,
      instagram_link,
    };

    this.subscriptions.push(
      this.organisationsService.createOrganisation(this.organisationData).subscribe(
        (res) => {
          this.organisationId = res['data']['organisation_id'];
        },
        (err) => {
          console.log(err);
          this.snackbarService.openSnackBar(this.snackbarService.DialogList.create_organisation.error, false);
        },
        () => {
          this.snackbarService.openSnackBar(this.snackbarService.DialogList.create_organisation.success, true);
          this.router.navigate(['/organisation/' + this.organisationId]);
        },
      ),
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
