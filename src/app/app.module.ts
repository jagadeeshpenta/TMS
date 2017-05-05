import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { routes } from './app.router';
import './Shared/app.constants';
import { ToastrModule } from '../../node_modules/toastr-ng2';

import { AppComponent } from './app.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { FooterComponent } from './components/footer/footer.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

import '../../node_modules/ng2-bootstrap';
// import { Ng2BootstrapModule } from '../../node_modules/ng2-bootstrap'; 
import { TodoModule } from './components/todo'
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { TimeSheetComponent } from './components/time-sheet/time-sheet.component';
import { MyTeamComponent } from './components/my-team/my-team.component';
import { EmployeesComponent } from './components/employees/employees.component';
import { ReportsComponent } from './components/reports/reports.component';
import { NotificationComponent } from './components/notification/notification.component';


import { AuthService } from './Shared/auth/auth.service';
import { AuthGuard } from './Shared/auth.guard';
import { UserService } from './components/todo/user.service';
import { DBService } from './Shared/dbservice';
import { RootService } from './Shared/root-service';


import { UiForApiModule } from './ui-for-api/ui-for-api.module';
import { environment } from './../environments/environment';
import { WaitingForApprovalsComponent } from './components/waiting-for-approvals/waiting-for-approvals.component';

var importModulesArr = [
  BrowserModule,
  FormsModule,
  HttpModule,
  TodoModule,
  routes,
  ToastrModule.forRoot()
];

if (!environment.production) {
  importModulesArr.push(UiForApiModule);
}

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    NotificationComponent,
    FooterComponent,
    DashboardComponent,
    LoginComponent,
    ProfileComponent,
    ChangePasswordComponent,
    TimeSheetComponent,
    MyTeamComponent,
    EmployeesComponent,
    ReportsComponent,
    WaitingForApprovalsComponent
  ],
  imports: importModulesArr,
  providers: [AuthService, UserService, AuthGuard, DBService, RootService],
  bootstrap: [AppComponent]
})
export class AppModule { }
