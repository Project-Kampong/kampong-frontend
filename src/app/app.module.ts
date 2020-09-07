import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { HashLocationStrategy, LocationStrategy } from "@angular/common";
import { CookieService } from "ngx-cookie-service";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

// Material Components
import { MatInputModule } from "@angular/material/input";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule, MAT_DATE_LOCALE } from "@angular/material";
import { MatChipsModule } from "@angular/material/chips";
import { MatIconModule } from "@angular/material/icon";
import { MatSelectModule } from "@angular/material/select";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatCheckboxModule } from "@angular/material/checkbox";

// Components
import { AppComponent } from "./app.component";
import { BannerComponent } from "./components/banner/banner.component";
import { ListingCardsComponent } from "./components/listing-cards/listing-cards.component";
import { ImageCarouselComponent } from "./components/image-carousel/image-carousel.component";
import { UpdateCarouselComponent } from "./components/update-carousel/update-carousel.component";
import { MilestonesComponent } from "./components/milestones/milestones.component";
import { ContentWrapperComponent } from "./layout/content-wrapper/content-wrapper.component";
import { EditListingCardsComponent } from "./components/edit-listing-cards/edit-listing-cards.component";
import { SnackbarErrorComponent } from "./components/snackbar-error/snackbar-error.component";
import { SnackbarSuccessComponent } from "./components/snackbar-success/snackbar-success.component";

// Pages
import { ListingHomeComponent } from "@app/pages/listing-home/listing-home.component";
import { ListingIndividualComponent } from "@app/pages/listing-individual/listing-individual.component";
import { UserProfileComponent } from "@app/pages/user-profile/user-profile.component";
import { LoginComponent } from "@app/pages/login/login.component";
import { RegisterComponent } from "@app/pages/register/register.component";
import { EditProfileComponent } from "@app/pages/edit-profile/edit-profile.component";
import { CreateListingComponent } from "@app/pages/create-listing/create-listing.component";
import { PublicProfileComponent } from "@app/pages/public-profile/public-profile.component";
import { EditListingComponent } from "@app/pages/edit-listing/edit-listing.component";
import { SearchComponent } from "@app/pages/search/search.component";
import { OnboardingComponent } from './pages/onboarding/onboarding.component';

@NgModule({
  declarations: [
    AppComponent,
    ListingHomeComponent,
    BannerComponent,
    ListingCardsComponent,
    ListingIndividualComponent,
    ImageCarouselComponent,
    UpdateCarouselComponent,
    MilestonesComponent,
    UserProfileComponent,
    LoginComponent,
    ContentWrapperComponent,
    RegisterComponent,
    EditProfileComponent,
    CreateListingComponent,
    PublicProfileComponent,
    EditListingCardsComponent,
    EditListingComponent,
    SearchComponent,
    SnackbarErrorComponent,
    SnackbarSuccessComponent,
    OnboardingComponent,
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
  ],
  exports: [],
  entryComponents: [SnackbarSuccessComponent, SnackbarErrorComponent],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: "en-GB" },
    CookieService,
    // Production Line
    // { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
