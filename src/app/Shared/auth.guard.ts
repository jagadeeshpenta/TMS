import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Cookie } from 'ng2-cookies';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private _router: Router) { }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (next.url[0].path == 'login') {
            // if (Cookie.get('auth_key')) {
            //     // if(this._router.url == 'login'){ // if already logged in and typed /login in browser url
            //     //      this._router.navigate(['./dashboard']);
            //     //        return false;
            //     //  }
            //     return false;
            // }
            // else {
            //     return true;
            // }
            return true;
        } else {
            if (Cookie.get('lToken')) {
                return true;
            }
        }

        this._router.navigate(['/login']);
        return false;
    }


}