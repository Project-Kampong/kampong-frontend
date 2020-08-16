import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

// Layouts
import { ContentWrapperComponent } from "./layout/content-wrapper/content-wrapper.component";

// Import Components
import { ListingHomeComponent } from "./listing-home/listing-home.component";
import { ListingIndividualComponent } from "./listing-individual/listing-individual.component";
import { UserProfileComponent } from "./user-profile/user-profile.component";
import { PublicProfileComponent } from "./public-profile/public-profile.component";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { EditProfileComponent } from "./edit-profile/edit-profile.component";
import { CreateListingComponent } from "./create-listing/create-listing.component";
import { EditListingComponent } from "./edit-listing/edit-listing.component";

//ContentWrapperComponent
const routes: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full" },
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
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
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
