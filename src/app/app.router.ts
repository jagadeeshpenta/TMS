import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './components/dashboard/dashboard.component'
import { LoginComponent } from './components/login/login.component';

export const router: Routes = [
   
    { path: 'dashboard', component: DashboardComponent },
    { path: 'login', component: LoginComponent},

    { path: '**', redirectTo: 'login', pathMatch: 'full' }
];

export const routes: ModuleWithProviders = RouterModule.forRoot(router);