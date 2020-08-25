import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";

import { HashLocationStrategy, LocationStrategy } from "@angular/common";

import { CookieService } from "ngx-cookie-service";

// Material Components
import { MatInputModule } from "@angular/material/input";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule, MAT_DATE_LOCALE } from "@angular/material";
import { MatChipsModule } from "@angular/material/chips";
import { MatIconModule } from "@angular/material/icon";
import { MatSelectModule } from "@angular/material/select";

// Components
import { AppComponent } from "./app.component";
import { ListingHomeComponent } from "./listing-home/listing-home.component";
import { BannerComponent } from "./components/banner/banner.component";
import { ListingCardsComponent } from "./components/listing-cards/listing-cards.component";
import { ListingIndividualComponent } from "./listing-individual/listing-individual.component";
import { ImageCarouselComponent } from "./components/image-carousel/image-carousel.component";
import { UpdateCarouselComponent } from "./components/update-carousel/update-carousel.component";
import { MilestonesComponent } from "./components/milestones/milestones.component";
import { UserProfileComponent } from "./user-profile/user-profile.component";
import { LoginComponent } from "./login/login.component";
import { ContentWrapperComponent } from "./layout/content-wrapper/content-wrapper.component";
import { RegisterComponent } from "./register/register.component";
import { EditProfileComponent } from "./edit-profile/edit-profile.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CreateListingComponent } from "./create-listing/create-listing.component";
import { PublicProfileComponent } from "./public-profile/public-profile.component";
import { EditListingCardsComponent } from "./components/edit-listing-cards/edit-listing-cards.component";
import { EditListingComponent } from "./edit-listing/edit-listing.component";
import { SearchComponent } from './search/search.component';

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
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: "en-GB" },
    CookieService,
    // Production Line
    // { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
