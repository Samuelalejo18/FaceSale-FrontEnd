import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ArtService {
  apiUri = 'api/';

  httpOptions = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) {}

  getAllArtData(): Observable<any> {
    return this.http.get<any>(this.apiUri + 'getArts');
  }

  getArtById(id: string): Observable<any> {
    return this.http.get<any>(this.apiUri + 'getArt/' + id);
  }
}
