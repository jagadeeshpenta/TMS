import { Component, OnChanges, OnInit } from '@angular/core';
import { Cookie } from 'ng2-cookies';
import { AuthService } from './Shared/auth/auth.service';
import { Router, NavigationStart } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnChanges, OnInit {
  title = 'app works!';
  user;

  constructor(public auth: AuthService, private router: Router) {
    router.events.subscribe((val) => {
      if (val instanceof NavigationStart && val.url !== '/login') {
        auth.checkUser().then(({ err, result }) => {
          if (err) {
            router.navigateByUrl('/login');
          } else {
            this.user = result.profile;
          }
        });
      }
    });
  }

  ngOnChanges() {
  }

  ngOnInit() {
  }

}
