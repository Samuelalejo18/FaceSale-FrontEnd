import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';
@Injectable({
  providedIn: 'root',
})
export class AuctionService {
  apiUri = '/api/';

  httpOptions = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) {}

  getAllAuctionData(): Observable<any> {
    return this.http.get<any>(
      environment.apiUrl + this.apiUri + 'getAuctions',
      {
        withCredentials: true,
      }
    );
  }

  getAuctionById(id: string): Observable<any> {
    return this.http.get<any>(
      environment.apiUrl + this.apiUri + 'getAuctionByID/' + id,
      {
        withCredentials: true,
      }
    );
  }

  getAuctionByIdArt(id: string): Observable<any> {
    return this.http.get<any>(
      environment.apiUrl + this.apiUri + 'getAuctionByIDArt/' + id,
      {
        withCredentials: true,
      }
    );
  }

  updateAuction(id: any, data: any): Observable<any> {
    console.log(data);
    return this.http.put<any>(
      environment.apiUrl + this.apiUri + 'updateAuction/' + id,
      data,
      {
        headers: this.httpOptions,
        withCredentials: true,
      }
    );
  }

  updateAuctionBid(id: any, data: any): Observable<any> {
    console.log(data);
    return this.http.put<any>(
      environment.apiUrl + this.apiUri + 'bidAuction/' + id,
      data,
      {
        headers: this.httpOptions,
        withCredentials: true,
      }
    );
  }

  updateAuctionFinalize(id: any, data: any): Observable<any> {
    console.log(data);
    return this.http.put<any>(
      environment.apiUrl + this.apiUri + 'Auction/' + id + '/finalize',
      data,
      {
        headers: this.httpOptions,
        withCredentials: true,
      }
    );
  }
}
