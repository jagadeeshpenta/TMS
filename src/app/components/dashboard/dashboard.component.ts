import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})

export class DashboardComponent implements OnInit {

  constructor(private _router: Router) { }

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
