import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BookingUpdate } from '../models/bookingUpdate';
import { Order } from '../models/order';

@Injectable({
  providedIn: 'root'
})
export class OrderServiceService {

  constructor(private http: HttpClient) { }

  apiBaseUrl = environment.apiBaseUrl;
  route = this.apiBaseUrl + "order/"

  getOrders(): Observable<Order> {
    const URL = `${this.route}getOrders`;
    return this.http.get<Order>(URL);
   }
  
  updateOrders(update: BookingUpdate): Observable<Order> {
    const URL = `${this.route}updateOrder`;
    return this.http.put<Order>(URL, update);
  }
}
