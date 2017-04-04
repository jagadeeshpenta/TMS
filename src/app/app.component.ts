import { Component } from '@angular/core';
import { Cookie } from 'ng2-cookies';
import { AuthService } from './Shared/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'app works!';
  user;

  constructor(public auth: AuthService, private router: Router, ) {
    auth.checkUser().then(({ err, result }) => {
      if (err) {
        router.navigateByUrl('/login');
      }
    });
  }

}
