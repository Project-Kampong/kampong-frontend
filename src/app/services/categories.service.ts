import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import { API } from '@app/interfaces/api';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  
  url: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) {
  }

  getAllCategories() {
    return this.httpClient.get<API>(this.url + 'api/categories');
  }
}
