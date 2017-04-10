import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './../../Shared/auth/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})

export class DashboardComponent implements OnInit {

  isLoaded = false;
  profile;

  constructor(private _router: Router, public auth: AuthService) {
    auth.checkUser().then(({ err, result }) => {
      this.isLoaded = true;
      if (!err) {
        this.profile = result.profile || result.user;
      }
    });
  }

  public goToTimesheet(): void {
    this._router.navigateByUrl('/time-sheet');
  }
  public goToMyTeam(): void {
    this._router.navigateByUrl('/my-team');
  }
  public goToEmployees(): void {
    this._router.navigateByUrl('/employees');
  }
  public goToReports(): void {
    this._router.navigateByUrl('/reports');
  }
  ngOnInit() {
  }

}
