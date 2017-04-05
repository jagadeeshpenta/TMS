import { Component, OnInit } from '@angular/core';
import { DBService } from './../../Shared/dbservice';
import { AuthService } from './../../Shared/auth/auth.service';

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

  constructor(public db: DBService, public auth: AuthService) {
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

  addEmployee() {
    this.db.addEmployee({ newEmployee: this.newEmployee }).then(({ err, result }) => {
      if (!err) {
        this.fllEmployees();
      }
    });

    $('#addEmployeeModal').modal('hide');
  }

  deleteEmployee(empToDelete) {
    this.db.deleteEmployee({ empToDelete }).then(({ err, result }) => {
      if (!err) {
        this.fllEmployees();
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
