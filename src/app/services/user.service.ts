import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  apiUri = 'api/';

  httpOptions = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) {}

  getAllUsersData(): Observable<any> {
    return this.http.get<any>(this.apiUri + 'getUsers');
  }
  getUserByID(id: number): Observable<any> {
    return this.http.get<any>(this.apiUri + 'getUserByID/' + id);
  }
}
