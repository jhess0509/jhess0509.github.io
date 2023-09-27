import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthguardService implements CanActivate{

  constructor(private router: Router) {} 
  canActivate() : boolean{
    {
      if (!this.gettoken()) {  
        this.router.navigateByUrl("/login");  
      }  
      return this.gettoken(); 
    }
  }

  gettoken(){  
    return !!localStorage.getItem("role");  
  }  
}
