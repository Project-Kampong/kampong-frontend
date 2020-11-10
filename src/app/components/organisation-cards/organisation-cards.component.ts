import { P } from '@angular/cdk/keycodes';
import { Component, OnInit, Input } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-organisation-cards",
  templateUrl: "./organisation-cards.component.html",
  styleUrls: ["./organisation-cards.component.scss"],
})
export class OrganisationCardsComponent{
  
  constructor(private router: Router) {
  }

  @Input() OrganisationData;
  @Input() ColNum;

  selectedCard(data) {
      console.log(data);
      this.router.navigate(["/organisation/" + data.organisation_id]);
  }
}