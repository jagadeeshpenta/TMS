import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './components/dashboard/dashboard.component'
import { LoginComponent } from './components/login/login.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { ProfileComponent } from './components/profile/profile.component';
import { TimeSheetComponent } from './components/time-sheet/time-sheet.component';
import { MyTeamComponent } from './components/my-team/my-team.component';
import { EmployeesComponent } from './components/employees/employees.component';
import { ReportsComponent } from './components/reports/reports.component';

export const router: Routes = [
    
    { path: 'dashboard', component: DashboardComponent },
    { path: 'login', component: LoginComponent },
    { path: 'change-password', component: ChangePasswordComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'time-sheet', component: TimeSheetComponent },
    { path: 'my-team', component: MyTeamComponent },
    { path: 'employees', component: EmployeesComponent },
    { path: 'reports', component: ReportsComponent },

{ path: '**', redirectTo: 'login', pathMatch: 'full' }
];

export const routes: ModuleWithProviders = RouterModule.forRoot(router);