import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { AuthService } from '../../Shared/auth/auth.service';
import { DBService } from './../../Shared/dbservice';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {



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
    $('.dropdown-toggle').dropdown('toggle');
    this._router.navigate(['login']);
  }

}
