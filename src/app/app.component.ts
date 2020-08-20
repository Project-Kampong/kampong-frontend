import { Component, OnInit } from "@angular/core";
import { AuthService } from "./services/auth.service";
import { environment } from "./../environments/environment";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  title = "Kampong-frontend";

  constructor(public AuthService: AuthService) {}

  ngOnInit() {
    this.AuthService.tokenExist();
  }
}
