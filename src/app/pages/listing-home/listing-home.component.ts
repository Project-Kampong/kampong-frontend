import { Component, OnInit } from "@angular/core";
import { ListingsService } from "@app/services/listings.service";
import { OrganisationsService } from '@app/services/organisations.service';
import { CategoryFilter } from '@app/interfaces/filters';
import { Organisation } from '@app/interfaces/organisation';
import { categoryList } from "@app/util/categories";
import { ListingIndividual } from "@app/interfaces/listing";
declare var $: any;

@Component({
  selector: "app-listing-home",
  templateUrl: "./listing-home.component.html",
  styleUrls: ["./listing-home.component.scss"],
})
export class ListingHomeComponent implements OnInit {

  categoryList: CategoryFilter[];
  organisationList: Organisation[] = [];
  listingList: ListingIndividual[] = [];

  constructor(
    private listingsService: ListingsService,
    private organisationService: OrganisationsService,
  ) {}

  ngOnInit() {

    window.scroll(0, 0);

    this.categoryList = categoryList;
    this.listingsService.getListings().subscribe(
      (res) => {
        this.listingList = res["data"];
      },
      (err) => {
        console.log(err);
      }
    );

    this.organisationService.getOrganisations().subscribe(
      (res) => {
        this.organisationList = res["data"];
      },
      (err) => {
        console.log(err);
      }
    );
    
  }
}
