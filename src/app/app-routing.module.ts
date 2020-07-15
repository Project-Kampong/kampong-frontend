import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

// Import Components
import { ListingHomeComponent } from "./listing-home/listing-home.component";
import { ListingIndividualComponent } from "./listing-individual/listing-individual.component";
import { UserProfileComponent } from "./user-profile/user-profile.component";

const routes: Routes = [
  { path: "home", component: ListingHomeComponent },
  { path: "listing", component: ListingIndividualComponent },
  { path: "profile", component: UserProfileComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
