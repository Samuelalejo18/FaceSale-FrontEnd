import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  apiUriGET = "api/getUsers";

  apiUriRegister = "api/register";
  apiUriLogin = "api/login";
  httpOptions = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) { }

  registerUser(data: any): Observable<any> {
    return this.http.post<any>(
      this.apiUriRegister,
      data,
      { headers: this.httpOptions });
  }

  loginUser(data: any): Observable<any> {
    return this.http.post<any>(
      this.apiUriLogin,
      data,
      { headers: this.httpOptions });
  }

  getAllUsersData(): Observable<any> {
    return this.http.get<any>(this.apiUriGET)
  }

}
