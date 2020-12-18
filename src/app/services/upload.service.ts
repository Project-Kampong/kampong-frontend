import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { API } from "@app/interfaces/api";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { AuthService } from "./auth.service";

interface OptionObject {
  headers: HttpHeaders;
  authorization?: string;
}

@Injectable({
  providedIn: "root",
})
export class UsersService {
  
  private url: string = environment.apiUrl;
  private options: OptionObject;

  constructor(private httpClient: HttpClient, private authService: AuthService) 
  {
    this.options = {
      headers: new HttpHeaders({
        'Authorization': "Bearer " + this.authService.AuthToken,
      }),
    };
  }

  /**
   * Upload file to S3
   * @param fd FormData with the files appended
   * @event POST
   */
  uploadFile(fd: FormData): Observable<API> {
    return this.httpClient.post<API>(
      this.url + "api/file-upload",
      fd,
      this.options
    )
  }
}