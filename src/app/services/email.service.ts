import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { API } from "@app/interfaces/api";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { SendApplication, SendEmail } from "@app/interfaces/email";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class EmailService {

  private url: string = environment.apiUrl;

  constructor(
    private httpClient: HttpClient, private authService: AuthService
  ) {}

  /**
   * Sends an email
   * @param data Email data
   * @event POST
   */
  sendEnquiry(data: SendEmail): Observable<API> {
    return this.httpClient.post<API>(
      this.url + "api/mailer/send-enquiry",
      data,
      this.authService.getAuthOptions()
    );
  }

  /**
   * Sends an application
   * @param data Email data
   * @event POST
   */
  sendApplication(data: SendApplication): Observable<API> {
    return this.httpClient.post<API>(
      this.url + 'api/mailer/send-application',
      data,
      this.authService.getAuthOptions());
  }

}
