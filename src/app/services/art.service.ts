import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';
@Injectable({
  providedIn: 'root',
})
export class ArtService {
  apiUri = '/api/';

  httpOptions = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) {}

  getAllArtData(): Observable<any> {
    return this.http.get<any>(this.apiUri + 'getArts');
  }

  getArtById(id: string): Observable<any> {
    return this.http.get<any>(
      environment.apiUrl + this.apiUri + 'getArt/' + id
    );
  }
  createArt(formData: FormData): Observable<any> {
    return this.http.post<any>(
      this.apiUri + 'createArt',
      formData
      // no pasamos headers: el browser pone multipart/form-data con el boundary
    );
  }
  updateArt(id: any, data: any): Observable<any> {
    console.log(data);
    return this.http.put<any>(this.apiUri + 'updateArt/' + id, data, {
      headers: this.httpOptions,
      withCredentials: true,
    });
  }

  deleteArt(id: any) {
    return this.http.delete<any>(this.apiUri + 'deleteArt/' + id, {
      headers: this.httpOptions,
      withCredentials: true,
    });
  }
}
