import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../Shared/auth/auth.service';
import { ToastrService, ToastConfig } from '../../../../node_modules/toastr-ng2';
import { DBService } from './../../Shared/dbservice';
declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  user = {
    username: '',
    password: ''
  };

  forgotusername='';

  showForgotMsg = false;

  checkUser = false;
  constructor(private _router: Router, private auth: AuthService, private toastrService: ToastrService, public db: DBService) {
    auth.checkUser().then(({ err, result }) => {
      this.checkUser = true;
      if (!err && result) {
        this._router.navigate(['/dashboard']);
      }
    });

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
        var toastCfg = new ToastConfig();
        toastCfg.timeOut = 1000;
        this.toastrService.error('', 'Username and password not Matched', toastCfg);
      } else {
        this._router.navigateByUrl('/dashboard');
      }
    });
  }

  forgotPwd(forgotusername) {
    this.db.forgotUserName(this.forgotusername).then((res) => {
      this.showForgotMsg = true;
    });
  }

  closeForgotModel() {
    //alert('hi close');
    $('#forgotPassModal').modal('hide');
    this.showForgotMsg = false;
  }
}
