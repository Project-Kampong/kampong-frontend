import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { API } from "@app/interfaces/api";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

interface OptionObject {
  headers: HttpHeaders;
  authorization?: string;
}

@Injectable({
  providedIn: "root",
})
export class UploadService {
  
  private url: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) 
  {}

  /**
   * Upload file to S3
   * @param fd FormData with the files appended
   * @param headers authOptionsWithoutContentType
   * @event POST
   */
  uploadFile(fd: FormData, headers: OptionObject): Observable<API> {
    return this.httpClient.post<API>(
      this.url + "api/file-upload",
      fd,
      headers
    )
  }
}