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

  updateUser(id: any, data: any): Observable<any> {
    console.log(data);
    return this.http.put<any>(this.apiUri + 'updateUser/' + id, data, {
      headers: this.httpOptions,
      withCredentials: true,
    });
  }

  deleteUser(id: any) {
    return this.http.delete<any>(this.apiUri + 'deleteUser/' + id, {
      headers: this.httpOptions,
      withCredentials: true,
    });
  }
}
