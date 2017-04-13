import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Cookie } from 'ng2-cookies';

import { environment } from './../../../environments/environment';

@Injectable()
export class AuthService {
  isAuthenticated: boolean = false;
  cookies: Object;
  user: Object;
  toDay: Date;

  baseUrl = environment.apiUrl;

  constructor(private http: Http) {
  }

  authenticate(creds) {
    var headers = new Headers();
    return new Promise((resolve) => {
      this.http.post(this.baseUrl + '/authenticate', {
        username: creds.username,
        password: creds.password,
        lToken: creds.lToken
      }, { headers: headers })
        .subscribe((data) => {
          var { err, result } = data.json();
          if (!err) {
            Cookie.set('lToken', result.lToken);
            this.user = result.profile;
            this.toDay = result.toDay;
          }
          resolve({ err, result });
        });
    });
  }

  checkUser() {
    return new Promise((res) => {
      if (Cookie.get('lToken')) {
        if (this.user) {
          res({ result: { user: this.user, profile: this.user, toDay: this.toDay } });
        } else {
          this.authenticate({ lToken: Cookie.get('lToken') }).then(({ err, result }) => {
            if (err) {
              res({ err: { code: 222 } });
            } else {
              res({ err, result });
            }
          });
        }
      } else {
        res({ err: { code: 222 } });
      }
    });

  }

  isLoggedIn() {
    if (this.user) { // if remove cookie from browser
      return true;
    } else {
      return false;
    }
  }

  logout() {
    Cookie.delete('lToken');
    this.isAuthenticated = false;
    this.user = null;
  }

}
