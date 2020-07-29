import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

// Layouts
import { ContentWrapperComponent } from "./layout/content-wrapper/content-wrapper.component";

// Import Components
import { ListingHomeComponent } from "./listing-home/listing-home.component";
import { ListingIndividualComponent } from "./listing-individual/listing-individual.component";
import { UserProfileComponent } from "./user-profile/user-profile.component";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { EditProfileComponent } from "./edit-profile/edit-profile.component";
import { CreateListingComponent } from "./create-listing/create-listing.component";

//ContentWrapperComponent
const routes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  {
    path: "",
    component: ContentWrapperComponent,
    children: [
      { path: "home", component: ListingHomeComponent },
      { path: "listing/:id", component: ListingIndividualComponent },
      { path: "create", component: CreateListingComponent },
      { path: "profile", component: UserProfileComponent },
      { path: "edit-profile", component: EditProfileComponent },
      { path: "", redirectTo: "home", pathMatch: "full" },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
