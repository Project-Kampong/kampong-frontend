import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import { API } from '@app/interfaces/api';

@Injectable({
  providedIn: 'root',
})
export class LocationsService {
  
  url: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) {
  }

  getAllLocations() {
    return this.httpClient.get<API>(this.url + 'api/locations');
  }
}
