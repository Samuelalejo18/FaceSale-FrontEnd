import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import Cookies from 'js-cookie';
import { IUser } from '../../interfaces/User';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiUri = 'api/';

  httpOptions = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) {}

  registerUser(formData: FormData): Observable<any> {
    return this.http.post<any>(
      this.apiUri + 'register',
      formData
      // no pasamos headers: el browser pone multipart/form-data con el boundary
    );
  }

  registerCredentialsUser(data: any): Observable<any> {
    return this.http.post<any>(this.apiUri + 'registerCredentials', data, {
      headers: this.httpOptions,
    });
  }

  loginUser(data: any): Observable<any> {
    return this.http.post<any>(this.apiUri + 'login', data, {
      headers: this.httpOptions,
    });
  }

  loginUserCredentials(data: any): Observable<any> {
    return this.http.post<any>(this.apiUri + 'loginCredentials', data, {
      headers: this.httpOptions,
    });
  }

  logout(): Observable<any> {
    Cookies.remove('token');
    return this.http.post<IUser>(this.apiUri + 'logout', {});
  }

  //Comprobar si esta logeado o no
  loggedIn(): Boolean {
    const token = Cookies.get('token');
    if (token) {
      return true;
    }
    return false;
  }

  reconocimientoFacial(data: any): Observable<any> {
    return this.http.post<any>(this.apiUri + 'reconocimientoFacial', data, {
      headers: this.httpOptions,
    });
  }

  verifyToken(): Observable<any> {
    return this.http.get<any>(this.apiUri + 'verify', {});
  }
}
