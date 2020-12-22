import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '@app/services/auth.service';
import { API } from '@app/interfaces/api';

@Injectable({
  providedIn: 'root',
})
export class LocationsService {
  url: string;

  constructor(private httpClient: HttpClient, private AuthService: AuthService) {
    this.url = this.AuthService.URL;
  }

  getAllLocations() {
    return this.httpClient.get<API>(this.url + 'api/locations');
  }
}
