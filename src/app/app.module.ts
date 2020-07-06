import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ListingHomeComponent } from './listing-home/listing-home.component';
import { BannerComponent } from './components/banner/banner.component';
import { ListingCardsComponent } from './components/listing-cards/listing-cards.component';

@NgModule({
  declarations: [
    AppComponent,
    ListingHomeComponent,
    BannerComponent,
    ListingCardsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
