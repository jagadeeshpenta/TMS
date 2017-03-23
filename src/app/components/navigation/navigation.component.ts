import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Shared/auth/auth.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html'
})
export class NavigationComponent {
loggedIn :boolean = false;
  constructor(private auth: AuthService) { 
    this.loggedIn = auth.isLoggedIn();
  }

  logout(){
    this.auth.logout();
  }

}
