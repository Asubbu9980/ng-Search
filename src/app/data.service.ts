import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private http: HttpClient
  ) { }

  getRoles() {
    return this.http.get('./assets/roles.json');
  }

  getCities() {
    return this.http.get('./assets/cities.json');
  }


}
