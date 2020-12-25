import { Component, Input } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-edit-organisation-cards",
  templateUrl: "./edit-organisation-cards.component.html",
  styleUrls: ["./edit-organisation-cards.component.scss"],
})
export class EditOrganisationCardsComponent{
  
  constructor(private router: Router) {
  }

  @Input() organisationData;
  @Input() colNum;

  selectedCard(data) {
      console.log(data);
      this.router.navigate(["/organisation/" + data.organisation_id]);
  }
}