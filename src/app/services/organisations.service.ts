import { Injectable } from "@angular/core";
import { HttpClient, HttpEvent, HttpHeaders } from "@angular/common/http";
import { CreateOrganisation, CreateProgrammes } from "@app/interfaces/organisation";
import { API } from "@app/interfaces/api";

// Services Import
import { AuthService } from "@app/services/auth.service";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: "root",
})
export class OrganisationsService {

  constructor(
    private httpClient: HttpClient,
    private AuthService: AuthService
  ) {}

  url: string = this.AuthService.URL;
  httpHeaders: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json",
  });

  options = {
    headers: this.httpHeaders,
  };

  getOrganisations(page: number): Observable<API> {
    return this.httpClient.get<API>(
      this.url + "api/organisations?sort=created_on&page=" + page,
      this.options
    );
  }

  getSearchResult(keyword: string): Observable<API> {
    return this.httpClient.get<API>(
      this.url +
        "api/organisations/search-title?title=" +
        keyword +
        "&limit=25&sensitivity=50",
      this.options
    );
  }

  getSelectedOrganisation(organisationId: string): Observable<API> {
    return this.httpClient.get<API>(
      this.url + "api/organisations/" + organisationId,
      this.options
    );
  }

  createOrganisation(data: CreateOrganisation): Observable<HttpEvent<API>> {
    return this.httpClient.post<API>(
      this.url + "api/organisations",
      data,
      this.AuthService.OnlyAuthHttpHeaders
    );
  }

  updateOrganisation(organisationId: string, data: CreateOrganisation): Observable<HttpEvent<API>> {
    return this.httpClient.put<API>(
      this.url + "api/organisations/" + organisationId,
      data,
      this.AuthService.OnlyAuthHttpHeaders
    );
  }

  removeOrganisation(organisationId: string): Observable<API> {
    return this.httpClient.delete<API>(
      this.url + "api/organisations/" + organisationId
    );
  }

  getProgrammes(page: number): Observable<API> {
    return this.httpClient.get<API>(
      this.url + "api/programmes?sort=created_on&page=" + page,
      this.options
    );
  }

  getSelectedProgramme(programmeId: number): Observable<API> {
    return this.httpClient.get<API>(
      this.url + "api/organisations/" + programmeId,
      this.options
    );
  }

  createProgrammes(data: CreateProgrammes): Observable<HttpEvent<API>> {
    return this.httpClient.post<API>(
      this.url + "api/programmes",
      data,
      this.AuthService.OnlyAuthHttpHeaders, 
    );
  }

  updateProgrammes(programmeId: number, data: CreateProgrammes): Observable<HttpEvent<API>> {
    return this.httpClient.put<API>(
      this.url + "api/programmes/" + programmeId,
      data,
      this.AuthService.OnlyAuthHttpHeaders
    );
  }

  removeProgrammes(programmeId: number): Observable<API>  {
    return this.httpClient.delete<API>(
      this.url + "api/programmes/" + programmeId
    );
  }

}
