import { Component, Input } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-organisation-cards",
  templateUrl: "./organisation-cards.component.html",
  styleUrls: ["./organisation-cards.component.scss"],
})
export class OrganisationCardsComponent{
  
  constructor(private router: Router) {
  }

  @Input() organisationData;
  @Input() colNum;

  selectedCard(data) {
      this.router.navigate(["/organisation/" + data.organisation_id]);
  }
}