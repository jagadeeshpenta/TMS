import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './../../Shared/auth/auth.service';
import { DBService } from './../../Shared/dbservice';
import { RootService } from './../../Shared/root-service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})

export class DashboardComponent implements OnInit {

  isLoaded = false;
  profile;

  isManager = false;

  permissions = {
    '801': false,
    '802': false,
    '803': false,
    '804': false
  };

  constructor(private _router: Router, public auth: AuthService, public db: DBService, public root: RootService) {
    auth.checkUser().then(({ err, result }) => {
      if (!err) {
        this.profile = result.profile || result.user;
        root.getAllData().then((prom) => {
          var employees = root.serviceData['Employees'];
          var allocations = root.serviceData['Allocations'];
          var projects = root.serviceData['Projects'];
          var myProjects = [];
          projects.forEach(p => {
            var alls = allocations.filter(a => { return a.projectid == p.id && a.empid == this.profile.empid });
            if (alls.length > 0) {
              if (!this.isManager) {
                this.isManager = alls[0].role == 'manager';
              }
              myProjects.push({ project: p, allocation: alls[0] });
            }
          });

          if (this.profile.role === 'user') {
            this.permissions['801'] = true;
          }

          if (this.profile.role === 'hr') {
            this.permissions['803'] = true;
            this.permissions['804'] = true;
          }

          if (this.profile.role === 'finance') {
            this.permissions['804'] = true;
          }

          if (this.isManager) {
            this.permissions['802'] = true;
          }

          if (this.profile.role === 'admin') {
            this.permissions['801'] = true;
            this.permissions['802'] = true;
            this.permissions['803'] = true;
            this.permissions['804'] = true;
          }
          this.isLoaded = true;
        })
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
