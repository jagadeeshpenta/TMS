import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { AuthService } from '../../Shared/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html'
})
export class NavigationComponent implements OnInit, OnChanges {

  loggedIn: boolean = false;
  profile;
  isLoaded = false;

  @Input()
  user;

  constructor(private auth: AuthService, public _router: Router) {
    auth.checkUser().then(({ err, result }) => {
      if (!err) {
        this.profile = result.profile;
        this.loggedIn = true;
      }
    });

  }

  ngOnInit() {
  }

  ngOnChanges(){
    if (this.user) {
      this.loggedIn = true;
    }
  }

  logout() {
    this.auth.logout();
    this.loggedIn = false;
    this._router.navigate(['login']);
  }

}
