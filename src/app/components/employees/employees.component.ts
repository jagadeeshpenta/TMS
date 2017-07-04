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
  EmployeesExcludeRoot;
  newEmployee = {
    id: 0,
    EmpIDExists: false,
    EmpMail: false,
    empid: '',
    emailid: ''
  };
  profile;
  expandpersonalfields = false;
  isEdit = false;
  employeesLoaded = false;

  roleNames = {
    'user': 'Employee',
    'admin': 'Admin',
    'hr': 'HR'
  };

 
  validateEmpId() {
    this.newEmployee.EmpIDExists = this.Employees.filter((emp) => {
      return emp.empid == this.newEmployee.empid;
    }).length > 0 ? true : false;
  }

  validateEmailId() {
    this.newEmployee.EmpMail = this.Employees.filter((emp) => {
      return emp.emailid == this.newEmployee.emailid;
    }).length > 0 ? true : false;
  }
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
        if (result instanceof Array) {
          this.employeesLoaded = true;
          this.Employees = result;
          this.EmployeesExcludeRoot = result.filter(emp => { return emp.empid != '0'; });
        }
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
    this.newEmployee.EmpIDExists = false;
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
