import { Component, OnInit } from "@angular/core";
import { ListingsService } from "@app/services/listings.service";
import { AuthService } from "@app/services/auth.service";
import { OrganisationsService } from '@app/services/organisations.service';
import { CategoryFilter } from '@app/interfaces/filters';
import { Organisation } from '@app/interfaces/organisation';
import { categoryList } from "@app/util/categories";
declare var $: any;

@Component({
  selector: "app-listing-home",
  templateUrl: "./listing-home.component.html",
  styleUrls: ["./listing-home.component.scss"],
})
export class ListingHomeComponent implements OnInit {

  categoryList: Array<CategoryFilter>;
  organisationList: Array<Organisation>;

  constructor(
    public ListingsService: ListingsService,
    public OrganisationService: OrganisationsService,
    public AuthService: AuthService
  ) {
    this.organisationList = [];
  }

  ngOnInit() {
    window.scroll(0, 0);
    $(".category-list ul li").on("click", function () {
      $(this).toggleClass("active");
    });

    $(".category-filter ul li .outline").on("click", function () {
      $(this).toggleClass("active");
    });

    this.categoryList = categoryList;
    this.ListingsService.getListingLoop(1);

    this.OrganisationService.getOrganisations(1).subscribe(
      (res) => {
        this.organisationList = res["data"];
      },
      (err) => {
        console.log(err);
      }
    );
    
  }
}
