import { Component, OnInit } from '@angular/core';
import { DBService } from './../../Shared/dbservice';
declare var $: any;
import { ToastrService } from '../../../../node_modules/toastr-ng2';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  changePasswordModel = {
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  };
  constructor(public db: DBService, private toastrService: ToastrService) { }

  ngOnInit() {
  }

  changePassword() {
    if (this.changePasswordModel.newPassword === this.changePasswordModel.confirmNewPassword) {
      this.db.changePassword(this.changePasswordModel).then(({ err, result}) => {
        $('#changePasswordModal').modal('hide');
      });
      
    } else {
      this.toastrService.error('', 'Username and password not Matched');
    }

  }

  close() {
    $('#changePasswordModal').modal('hide');
  }

}
