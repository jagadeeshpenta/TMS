import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Shared/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html'
})
export class NavigationComponent {

  loggedIn: boolean = false;
  constructor(private auth: AuthService, private _router: Router) {
    // this.loggedIn = auth.isLoggedIn();
  }

  logout() {
    this.auth.logout();
    this._router.navigate(['login']);
  }

}
