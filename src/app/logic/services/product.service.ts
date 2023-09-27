import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  apiBaseUrl = environment.apiBaseUrl
  route = this.apiBaseUrl + "product/"

  getProducts(): Observable<Product> {
    const URL = `${this.route}getProducts`;
    return this.http.get<Product>(URL);
   }
}
