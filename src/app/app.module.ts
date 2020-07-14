import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ListingHomeComponent } from './listing-home/listing-home.component';
import { BannerComponent } from './components/banner/banner.component';
import { ListingCardsComponent } from './components/listing-cards/listing-cards.component';
import { ListingIndividualComponent } from './listing-individual/listing-individual.component';
import { ImageCarouselComponent } from './components/image-carousel/image-carousel.component';
import { UpdateCarouselComponent } from './components/update-carousel/update-carousel.component';
import { MilestonesComponent } from './components/milestones/milestones.component';

@NgModule({
  declarations: [
    AppComponent,
    ListingHomeComponent,
    BannerComponent,
    ListingCardsComponent,
    ListingIndividualComponent,
    ImageCarouselComponent,
    UpdateCarouselComponent,
    MilestonesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
