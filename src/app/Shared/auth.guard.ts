import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Cookie } from 'ng2-cookies';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private _router: Router) { }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (next.url[0].path == 'login') {
            if (Cookie.get('auth_key')) {
                console.log('You are already logged in');
                return false;
            }
            else {
                return true;
            }
        }

        if (Cookie.get('auth_key')) {
            return true;
        }

        console.log('You must be logged in');
        this._router.navigate(['/login']);
        return false;
    }


}