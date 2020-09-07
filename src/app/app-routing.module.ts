import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

// Layouts
//ContentWrapperComponent
import { ContentWrapperComponent } from "./layout/content-wrapper/content-wrapper.component";

// Import Components
import { ListingHomeComponent } from "@app/pages/listing-home/listing-home.component";
import { ListingIndividualComponent } from "@app/pages/listing-individual/listing-individual.component";
import { UserProfileComponent } from "@app/pages/user-profile/user-profile.component";
import { PublicProfileComponent } from "@app/pages/public-profile/public-profile.component";
import { LoginComponent } from "@app/pages/login/login.component";
import { RegisterComponent } from "@app/pages/register/register.component";
import { EditProfileComponent } from "@app/pages/edit-profile/edit-profile.component";
import { CreateListingComponent } from "@app/pages/create-listing/create-listing.component";
import { EditListingComponent } from "@app/pages/edit-listing/edit-listing.component";
import { SearchComponent } from "@app/pages/search/search.component";
import { OnboardingComponent } from "@app/pages/onboarding/onboarding.component";

const routes: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full" },
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "search", component: SearchComponent },
  {
    path: "",
    component: ContentWrapperComponent,
    children: [
      { path: "home", component: ListingHomeComponent },
      { path: "listing/:id", component: ListingIndividualComponent },
      { path: "create", component: CreateListingComponent },
      { path: "edit/:id", component: EditListingComponent },
      { path: "profile", component: UserProfileComponent },
      { path: "edit-profile", component: EditProfileComponent },
      { path: "profile/:id", component: PublicProfileComponent },
      { path: "onboarding", component: OnboardingComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
