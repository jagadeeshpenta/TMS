import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../Shared/auth/auth.service';
import { ToastsManager } from '../../../../node_modules/ng2-toastr/ng2-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  user = {
    email: '',
    password: ''
  }
  constructor(private _router: Router, private auth:AuthService,public toastr: ToastsManager) { 
     this.toastr.success('You are awesome!', 'Success!');
  }


  public Login(): void {
    this._router.navigateByUrl('/dashboard');
    console.log('localUser', this.user);
    let checknow = this.auth.authenticate(this.user);
    checknow.then((res) => {
      if (res) {
        console.log(res);
        this._router.navigate(['/dashboard']);
      } else {
        console.log('Invalid user');
      }
    });
  }

}
