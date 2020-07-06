import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

// Import Components
import { ListingHomeComponent } from "./listing-home/listing-home.component";

const routes: Routes = [{ path: "home", component: ListingHomeComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
