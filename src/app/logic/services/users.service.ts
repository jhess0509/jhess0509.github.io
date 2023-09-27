import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user-model/user-model.component';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  apiBaseUrl = environment.apiBaseUrl
  route = this.apiBaseUrl + "users/"

  getUsers(): Observable<User> {
    const URL = `${this.route}getUsers`;
    return this.http.get<User>(URL);
   }
  getRoles(): Observable<string[]> {
    const URL = `${this.route}getRoles`;
    return this.http.get<string[]>(URL);
  }
  createUser(user: User): Observable<null>{
    const URL = `${this.route}createUser`;
    return this.http.post<null>(URL, user);
  }
}
