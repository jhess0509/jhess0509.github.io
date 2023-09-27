import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators';

@Injectable()
export class DashboardService {

    constructor(private http: HttpClient) { }
    
    apiBaseUrl = 'http://localhost:9999/'
    route = this.apiBaseUrl + "users/"

    private handleError(error: HttpErrorResponse) {
      console.error('An error occurred:', error.error.message);
      return throwError(
        'Something bad happened; please try again later.');
    }


    
}