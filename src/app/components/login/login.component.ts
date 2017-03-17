import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {

  constructor(private _router: Router) { }

  public Login():void {
      this._router.navigateByUrl('/dashboard')
  }

}
