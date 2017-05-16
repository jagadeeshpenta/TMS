import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Cookie } from 'ng2-cookies';

import { environment } from './../../../environments/environment';
import { DBService } from './../dbservice';

@Injectable()
export class AuthService {
  isAuthenticated: boolean = false;
  cookies: Object;
  user: Object;
  toDay: Date;

  baseUrl = environment.apiUrl;

  constructor(private http: Http, private db: DBService) {
  }

  authenticate(creds) {
    var headers = new Headers();
    return new Promise((resolve) => {

      this.db.makeRequest('/authenticate', this.db.Headers(), {
        username: creds.username,
        password: creds.password,
        lToken: creds.lToken
      }, 'POST').then(({ err, result }) => {
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
