import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate  {
  constructor(private auth:AngularFireAuth,
    private router:Router){

  }
  canActivate(){
    return this.auth.authState.pipe(map((usuario)=>{
      if(usuario){
        return true;
      }
      else {
        this.router.navigate(['/login']);
        return false;
      }
    }))
  }
}
