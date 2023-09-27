import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Product } from '../models/product';
import { User } from '../models/user-model/user-model.component';

@Injectable({
  providedIn: 'root',
})
export class LoginService {

    constructor(private http: HttpClient, private _router: Router, private toastr: ToastrService) { 

    }
    
    apiBaseUrl = environment.apiBaseUrl;
    route = this.apiBaseUrl + "auth/"

    signIn(user: User) : Observable<void>{
      return this.http.post<User>(this.route + "signIn/", {User: user}).pipe(
        map((res: any) => {
          //set access token refresh token and navigate here
          localStorage.setItem('role',res.role!);
          localStorage.setItem('name', res.name!);
          this._router.navigate(['pages/dashboard']);
          return;
        }),
        catchError((error: HttpErrorResponse) => {
          this.toastr.error("Error Logging In");
          return throwError('Something bad happened; please try again later.');
        }));
    }

    
}
