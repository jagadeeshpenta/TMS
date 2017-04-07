import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Shared/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html'
})
export class NavigationComponent {

  loggedIn: boolean = false;
  profile;
  constructor(private auth: AuthService, private _router: Router) {
    auth.checkUser().then(({ err, result }) => {
      if (!err) {
        this.profile = result.profile;
      }
    });
  }

  logout() {
    this.auth.logout();
    this._router.navigate(['login']);
  }



}
