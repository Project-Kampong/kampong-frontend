import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';

import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Material Components
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MatButtonModule,
  MatDialogModule,
  MatGridListModule,
  MatNativeDateModule,
  MatProgressSpinnerModule,
  MatTooltipModule,
  MAT_DATE_LOCALE,
} from '@angular/material';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatStepperModule } from '@angular/material/stepper';

// Components
import { AppComponent } from './app.component';
import { BannerComponent } from './components/banner/banner.component';
import { MainSearchComponent } from './components/main-search/main-search.component';
import { ImageCarouselComponent } from './components/image-carousel/image-carousel.component';
import { UpdateCarouselComponent } from './components/update-carousel/update-carousel.component';
import { MilestonesComponent } from './components/milestones/milestones.component';
import { ContentWrapperComponent } from './layout/content-wrapper/content-wrapper.component';
import { EditListingCardsComponent } from './components/edit-listing-cards/edit-listing-cards.component';
import { SnackbarErrorComponent } from './components/snackbar-error/snackbar-error.component';
import { SnackbarSuccessComponent } from './components/snackbar-success/snackbar-success.component';
import { OrgBannerComponent } from './components/organisation-banner/organisation-banner.component';
import { CropImageDialogComponent } from './components/crop-image-dialog/crop-image-dialog.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { ListingCardComponent } from './components/listing-card/listing-card.component';
import { ListingGridComponent } from './components/listing-grid/listing-grid.component';
import { OrganisationCardComponent } from './components/organisation-card/organisation-card.component';
import { OrganisationGridComponent } from './components/organisation-grid/organisation-grid.component';

// Pages
import { ListingHomeComponent } from '@app/pages/listing-home/listing-home.component';
import { ListingIndividualComponent } from '@app/pages/listing-individual/listing-individual.component';
import { OrganisationIndividualComponent } from '@app/pages/organisation-individual/organisation-individual.component';
import { UserProfileComponent } from '@app/pages/user-profile/user-profile.component';
import { LoginComponent } from '@app/pages/login/login.component';
import { RegisterComponent } from '@app/pages/register/register.component';
import { EditProfileComponent } from '@app/pages/edit-profile/edit-profile.component';
import { CreateListingComponent } from '@app/pages/create-listing/create-listing.component';
import { CreateOrganisationComponent } from '@app/pages/create-organisation/create-organisation.component';
import { PublicProfileComponent } from '@app/pages/public-profile/public-profile.component';
import { EditListingComponent } from '@app/pages/edit-listing/edit-listing.component';
import { SearchComponent } from '@app/pages/search/search.component';
import { OnboardingComponent } from './pages/onboarding/onboarding.component';
import { EditOrganisationCardsComponent } from './components/edit-organisation-cards/edit-organisation-cards.component';
import { MobxAngularModule } from 'mobx-angular';
import { ImageCropperModule } from 'ngx-image-cropper';
import { TermsAndConditionsComponent } from './components/terms-and-conditions/terms-and-conditions.component';

@NgModule({
  declarations: [
    AppComponent,
    ListingHomeComponent,
    BannerComponent,
    ListingIndividualComponent,
    OrganisationIndividualComponent,
    ImageCarouselComponent,
    UpdateCarouselComponent,
    MilestonesComponent,
    UserProfileComponent,
    LoginComponent,
    ContentWrapperComponent,
    RegisterComponent,
    EditProfileComponent,
    CreateListingComponent,
    CreateOrganisationComponent,
    PublicProfileComponent,
    EditListingCardsComponent,
    EditListingComponent,
    EditOrganisationCardsComponent,
    SearchComponent,
    SnackbarErrorComponent,
    SnackbarSuccessComponent,
    OnboardingComponent,
    MainSearchComponent,
    OrganisationCardComponent,
    OrganisationGridComponent,
    OrgBannerComponent,
    CropImageDialogComponent,
    DialogComponent,
    ListingCardComponent,
    ListingGridComponent,
    TermsAndConditionsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatIconModule,
    MatSelectModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatStepperModule,
    NgxPaginationModule,
    MobxAngularModule,
    MatProgressSpinnerModule,
    ImageCropperModule,
    MatDialogModule,
    MatTooltipModule,
    MatButtonModule,
    MatGridListModule,
  ],
  exports: [],
  entryComponents: [SnackbarSuccessComponent, SnackbarErrorComponent, CropImageDialogComponent, DialogComponent],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    CookieService,
    // Production Line
    // { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
