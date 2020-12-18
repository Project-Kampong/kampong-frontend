import { Injectable } from "@angular/core";
import { HttpClient, HttpEvent, HttpHeaders } from "@angular/common/http";
import { CreateOrganisation, UpdateOrganisation } from "@app/interfaces/organisation";
import { API } from "@app/interfaces/api";

// Services Import
import { Observable } from 'rxjs';
import { environment } from "src/environments/environment";

interface OptionObject {
  headers: HttpHeaders;
  authorization?: string;
}

@Injectable({
  providedIn: "root",
})
export class OrganisationsService {

  private url: string = environment.apiUrl;
  private options: OptionObject = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
    }),
  };

  constructor(private httpClient: HttpClient) {}

  /**
   * Get all organisations
   * @event GET
   */
  getOrganisations(): Observable<API> {
    return this.httpClient.get<API>(
      this.url + "api/organisations",
      this.options
    );
  }

  /**
   * Get a particular organisation
   * @param organisationId Organisation ID
   * @event GET
   */
  getSelectedOrganisation(organisationId: string): Observable<API> {
    return this.httpClient.get<API>(
      this.url + "api/organisations/" + organisationId,
      this.options
    );
  }

  /**
   * Create an organisation
   * @param data Organisation Data
   * @param headers authOptionsWithoutContentType
   * @event POST
   */
  createOrganisation(data: CreateOrganisation, headers: OptionObject): Observable<API> {
    return this.httpClient.post<API>(
      this.url + "api/organisations",
      data,
      headers
    );
  }

  /**
   * Update organisation details
   * @param organisationId Organisation ID
   * @param data Updated Organisation Data
   * @param headers authOptionsWithoutContentType
   * @event PUT
   */
  updateOrganisation(organisationId: string, data: UpdateOrganisation, headers: OptionObject): Observable<API> {
    return this.httpClient.put<API>(
      this.url + "api/organisations/" + organisationId,
      data,
      headers
    );
  }

  /**
   * Delete a particular organisation
   * @param organisationId Organisation ID
   * @param headers authOptions
   * @event DELETE
   */
  removeOrganisation(organisationId: string, headers: OptionObject): Observable<API> {
    return this.httpClient.delete<API>(
      this.url + "api/organisations/" + organisationId,
      headers
    );
  }

  /*
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
      this.authService.OnlyAuthHttpHeaders, 
    );
  }

  updateProgrammes(programmeId: number, data: CreateProgrammes): Observable<HttpEvent<API>> {
    return this.httpClient.put<API>(
      this.url + "api/programmes/" + programmeId,
      data,
      this.authService.OnlyAuthHttpHeaders
    );
  }

  removeProgrammes(programmeId: number): Observable<API>  {
    return this.httpClient.delete<API>(
      this.url + "api/programmes/" + programmeId
    );
  }
  */

}
