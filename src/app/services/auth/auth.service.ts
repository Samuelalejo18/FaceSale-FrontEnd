import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import Cookies from 'js-cookie';
@Injectable({
  providedIn: 'root'
})
export class AuthService {




  apiUri = "api/"

  httpOptions = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) { }

  registerUser(data: any): Observable<any> {
    return this.http.post<any>(
      this.apiUri + "register",
      data,
      { headers: this.httpOptions });
  }

  loginUser(data: any): Observable<any> {
    return this.http.post<any>(
      this.apiUri + "login",
      data,
      { headers: this.httpOptions });
  }

  getAllUsersData(): Observable<any> {
    return this.http.get<any>(this.apiUri + "getUsers")
  }

  logout(): Observable<any> {
    return this.http.post<any>(
      this.apiUri + "logout",
      {}
    )

  }


  //Comprobar si esta logeado o no
  loggedIn(): Boolean {
    const token = Cookies.get("token");
    if (token) {
      return true;
    }
    return false;
  }

}
