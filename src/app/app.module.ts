import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { routes } from './app.router';
import './Shared/app.constants';

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


import { AuthService } from './Shared/auth/auth.service';
import { AuthGuard } from './Shared/auth.guard';
import { UserService } from './components/todo/user.service';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    FooterComponent,
    DashboardComponent,
    LoginComponent,
    ProfileComponent,
    ChangePasswordComponent,
    TimeSheetComponent,
    MyTeamComponent,
    EmployeesComponent,
    ReportsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    TodoModule,
    routes,
  ],
  providers: [AuthService, UserService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
