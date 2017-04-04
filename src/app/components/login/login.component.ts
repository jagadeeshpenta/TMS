import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../Shared/auth/auth.service';
import { ToastrService } from '../../../../node_modules/toastr-ng2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  user = {
    username: '',
    password: ''
  }
  constructor(private _router: Router, private auth: AuthService, private toastrService: ToastrService) {


  }


  public Login(): void {
    // this._router.navigateByUrl('/dashboard');
    // let checknow = this.auth.authenticate(this.user);
    // checknow.then((res) => {
    //   if (res) {
    //     this.toastrService.success('', 'login has been success!');
    //     this._router.navigate(['/dashboard']);
    //   } else {
    //     this.toastrService.error('', 'Failed login! please check again!');
    //   }
    // });
    this.auth.authenticate(this.user).then(({ err, result }) => {
      if (err) {
        this.toastrService.error('', 'Username and password not Matched');
      } else {
        this._router.navigateByUrl('/dashboard');
      }
    });
  }

}
