import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './Shared/auth.guard';

import { DashboardComponent } from './components/dashboard/dashboard.component'
import { LoginComponent } from './components/login/login.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { ProfileComponent } from './components/profile/profile.component';
import { TimeSheetComponent } from './components/time-sheet/time-sheet.component';
import { MyTeamComponent } from './components/my-team/my-team.component';
import { EmployeesComponent } from './components/employees/employees.component';
import { ReportsComponent } from './components/reports/reports.component';
import { TodoComponent } from './components/todo/todo.component';

export const router: Routes = [
    { path: 'login', component: LoginComponent, canActivate:[AuthGuard]  },
    { path: 'dashboard', component: DashboardComponent, canActivate:[AuthGuard] },
    { path: 'change-password', component: ChangePasswordComponent, canActivate:[AuthGuard] },
    { path: 'profile', component: ProfileComponent },
    { path: 'time-sheet', component: TimeSheetComponent, canActivate:[AuthGuard] },
    { path: 'my-team', component: MyTeamComponent, canActivate:[AuthGuard] },
    { path: 'employees', component: EmployeesComponent, canActivate:[AuthGuard] },
    { path: 'reports', component: ReportsComponent, canActivate:[AuthGuard] },
    { path: 'todo', component: TodoComponent },

{ path: '**', redirectTo: 'dashboard', pathMatch: 'full' }
];


export const routes: ModuleWithProviders = RouterModule.forRoot(router);