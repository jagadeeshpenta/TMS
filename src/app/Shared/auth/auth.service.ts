import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Cookie } from 'ng2-cookies';

@Injectable()
export class AuthService {
  isAuthenticated: boolean = false;
  cookies: Object;

  constructor(private http: Http) { 
  }

  authenticate(userCredentials){
    var userData = 'name=' + userCredentials.email + '&password=' + userCredentials.password;

    var headers = new Headers();
    headers.append('Content-Type', 'application/X-www-form-urlencoded');

    return new Promise((resolve) => {
        this.http.post('http://localhost:8080/api/authenticate', userData, {headers: headers}).subscribe((data) => {
            if(data.json().success) {
                console.log('auth_key', data.json().token);
                 Cookie.set('auth_key', data.json().token);
                this.isAuthenticated = true;}
                resolve(this.isAuthenticated);
            }
        )
    });
  }



}
