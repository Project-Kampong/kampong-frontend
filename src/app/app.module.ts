import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

// Material Components
import { MatInputModule } from "@angular/material/input";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule, MAT_DATE_LOCALE } from "@angular/material";

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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: "en-GB" }],
  bootstrap: [AppComponent],
})
export class AppModule {}
