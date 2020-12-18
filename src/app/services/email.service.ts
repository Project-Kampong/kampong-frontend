import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpEvent } from "@angular/common/http";
import { API } from "@app/interfaces/api";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { SendEmail } from "@app/interfaces/email";

interface OptionObject {
  headers: HttpHeaders;
  authorization?: string;
}

@Injectable({
  providedIn: "root",
})
export class EmailService {

  private options: OptionObject = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
    }),
  };
  private url: string = environment.apiUrl;

  constructor(
    private httpClient: HttpClient,
  ) {}

  /**
   * Sends an email
   * @param data Email data
   * @event POST
   */
  sendEnquiry(data: SendEmail): Observable<API> {
    return this.httpClient.post<API>(
      this.url + "api/mailer/send",
      data,
      this.options
    );
  }

}