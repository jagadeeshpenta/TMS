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
  isLoaded = false;
  constructor(private auth: AuthService, public _router: Router) {
    auth.checkUser().then(({ err, result }) => {
      if (!err) {
        this.profile = result.profile;
        this.loggedIn = true;
        console.log('its logged In ', this.loggedIn);
      }
    });
 
  }

  logout() {
    this.auth.logout();
    this.loggedIn = false;
    this._router.navigate(['login']);
  }



}
