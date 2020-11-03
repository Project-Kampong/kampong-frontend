import { Injectable, EventEmitter } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Organisation, DefaultOrganisation } from "@app/interfaces/organisation";
import { API } from "@app/interfaces/api";

// Services Import
import { AuthService } from "@app/services/auth.service";
import { title } from "process";
@Injectable({
  providedIn: "root",
})
export class OrganisationsService {
  constructor(
    private httpClient: HttpClient,
    private AuthService: AuthService
  ) {}

  // URL
  url = this.AuthService.URL;

  httpHeaders = new HttpHeaders({
    "Content-Type": "application/json",
  });
  options = {
    headers: this.httpHeaders,
  };

  // Variables
  OrganisationData: Organisation[];
  tempOrganisationData: Organisation[] = [];
  FeaturedOrganisationData: Organisation[];

  getOrganisations(page: number) {
    return this.httpClient.get<API>(
      this.url + "api/organisations?sort=created_on&page=" + page,
      this.options
    );
  }
//   not sure what this is for yet
  getOrganisationsLoop(pagenum) {
    this.getOrganisations(pagenum).subscribe((data) => {
      this.tempOrganisationData.push(...data["data"]);
      this.FeaturedOrganisationData = data["data"];
      if (data["pagination"]["next"] != null) {
        this.getOrganisationsLoop(data["pagination"]["next"]["page"]);
      } else {
        this.OrganisationData = this.tempOrganisationData;
        this.tempOrganisationData = [];
      }
    });
  }

  getSearchResult(keyword) {
    return this.httpClient.get<API>(
      this.url +
        "api/organisations/search-title?title=" +
        keyword +
        "&limit=25&sensitivity=50",
      this.options
    );
  }

  getSelectedOrganisation(organisationId) {
    return this.httpClient.get<API>(
      this.url + "api/organisations/" + organisationId,
      this.options
    );
  }

  createOrganisation(data) {
    return this.httpClient.post<API>(
      this.url + "api/organisations",
      data,
      this.AuthService.OnlyAuthHttpHeaders
    );
  }

  updateOrganisation(organisationId, data) {
    return this.httpClient.put<API>(
      this.url + "api/organisations/" + organisationId,
      data,
      this.AuthService.OnlyAuthHttpHeaders
    );
  }

  removeOrganisation(organisationId) {
    return this.httpClient.put<API>(
      this.url + "api/organisations/" + organisationId + "/deactivate",
      {},
      this.AuthService.AuthOptions
    );
  }
}
