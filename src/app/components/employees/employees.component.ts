import { Component, OnInit } from '@angular/core';
import { DBService } from './../../Shared/dbservice';
import { AuthService } from './../../Shared/auth/auth.service';

import { ToastrService, ToastConfig } from '../../../../node_modules/toastr-ng2';

declare var $: any;

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit {

  Employees;
  newEmployee = {
    id: 0
  };
  profile;

  isEdit = false;
  employeesLoaded = false;

  constructor(public db: DBService, public auth: AuthService, private toastrService: ToastrService) {
    auth.checkUser().then(({ err, result }) => {
      if (!err) {
        this.profile = result.profile || result.user;
        this.fllEmployees();
      }
    });
  }

  ngOnInit() {

  }

  fllEmployees() {
    this.db.getLists({ entityName: '/employees' }).then(({ err, result }) => {
      if (!err) {
        this.employeesLoaded = true;
        this.Employees = result;
      }
    });
  }

  getEmployeeByEmpId(empid) {
    var emps = this.Employees.filter((emp) => {
      if (empid == emp.empid) {
        return true;
      }
      return false;
    });
    return emps.length > 0 ? emps[0] : { firstname: '', lastname: '' };
  }

  addEmployee() {
    
    this.db.addEmployee({ newEmployee: this.newEmployee }).then(({ err, result }) => {
      if (!err) {
        this.fllEmployees();
        var toastrMessage = (this.isEdit ? 'Updating' : 'Adding') + ' employee successfully';
        this.db.toastrInstance.success('', toastrMessage, this.db.toastCfg);
      } else {
        this.db.toastrInstance.error('', 'Failed adding employee', this.db.toastCfg);
      }
    });

    $('#addEmployeeModal').modal('hide');
  }

  deleteEmployee(empToDelete) {
    this.db.deleteEmployee({ empToDelete }).then(({ err, result }) => {
      if (!err) {
        this.fllEmployees();
        this.db.toastrInstance.success('', 'Deleted employee succesfully', this.db.toastCfg);
      }
    });
  }

  openAddEmployeeModal(fm) {
    fm.reset();
    fm.resetForm();
    this.newEmployee.id = 0;

    $('#addEmployeeModal').modal('show');
  }

  editEmployee(emp, fm) {
    this.isEdit = true;
    this.newEmployee = Object.assign({}, emp);
    Object.keys(this.newEmployee).forEach((t) => {
      if (this.newEmployee[t] === 'null') { this.newEmployee[t] = null; }
    });
    $('#addEmployeeModal').modal('show');
  }
}
