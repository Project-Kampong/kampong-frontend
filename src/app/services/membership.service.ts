import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API } from '@app/interfaces/api';

// Services Import
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

interface OptionObject {
  headers: HttpHeaders;
  authorization?: string;
}

@Injectable({
  providedIn: 'root',
})
export class MembershipService {
  private url: string = environment.apiUrl;

  private options: OptionObject = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private httpClient: HttpClient, private authService: AuthService) {}

  joinOrganisation(data): Observable<API> {
    return this.httpClient.post<API>(this.url + 'api/listings-organisations', data, this.authService.getAuthOptionsWithoutContentType());
  }
}
