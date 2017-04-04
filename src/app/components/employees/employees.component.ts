import { Component, OnInit } from '@angular/core';
import { DBService } from './../../Shared/dbservice';
declare var $: any;

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit {

  Employees;
  newEmployee = {
    reportingmanager: 0
  };

  constructor(public db: DBService) {

  }

  ngOnInit() {
    this.fllEmployees();
  }

  fllEmployees() {
    this.db.getLists({ entityName: '/employees' }).then(({ err, result }) => {
      if (!err) {
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
    $('#addEmployeeModal').modal('show');
  }

}
