import { Component, OnInit } from '@angular/core';
import { DBService } from './../../Shared/dbservice';
import { AuthService } from './../../Shared/auth/auth.service';
declare var $: any;

@Component({
  selector: 'app-my-team',
  templateUrl: './my-team.component.html',
  styleUrls: ['./my-team.component.scss']
})
export class MyTeamComponent implements OnInit {

  newProject = {
    name: '',
    actualstartdate: '',
    actualenddate: ''
  };

  employeeToProject = {
    project: {},
    empadd: '',
    role: 'member',
    emp: {},
    showSuggestions: false
  };

  profile = {};
  
  Projects = [];
  Employees = [];
  Allocations = [];
  EmployeeSuggestions = [];

  allocationLoaded = false;
  employeesLoaded = false;

  projectsProcessed = false;
  constructor(public db: DBService, public auth: AuthService) {

    auth.checkUser().then(({ err, result }) => {
      if (!err) {
        this.profile = result.profile || result.user;
        this.fillProjects();
      }
    });
  }

  ngOnInit() {
  }

  fillProjects() {
    this.db.getLists({ entityName: '/projects' }).then(({ err, result }) => {
      if (!err) {
        this.Projects = result;
        this.getAllocationsandEmployees();
      }
    });
  }

  processDate() {
    if (this.allocationLoaded && this.employeesLoaded) {
      if (this.Projects.length > 0) {
        this.Projects.forEach((project) => {
          project.Employees = this.Employees.filter((employee) => {
            var alls = this.Allocations.filter((a) => {
              if (a.projectid == project.id && a.empid == employee.empid) {
                return true;
              }
              return false;
            });
            if (alls.length > 0) {
              return true;
            }
            return false;
          });
        });

        this.projectsProcessed = true;
      }

    }
  }

  getAllocationType(projectid, empid) {
    var allocs =  this.Allocations.filter((a) => {
      if (a.projectid == projectid && a.empid == empid) {
        return true;
      }
      return false;
    });
    return allocs.length > 0 ? allocs[0].role : '';
  }



  getAllocationsandEmployees() {
    this.db.getLists({ entityName: '/employees' }).then(({ err, result }) => {
      if (!err) {
        this.employeesLoaded = true;
        this.Employees = result;
        this.processDate();
      }
    });
    this.db.getLists({ entityName: '/allocations' }).then(({ err, result }) => {
      if (!err) {
        this.allocationLoaded = true;
        this.Allocations = result;
        this.processDate();
      }
    });
  }

  addProject() {
    this.db.addProject(this.newProject).then(({ err, result }) => {
      if (!err) {
        $('#addProjectModal').modal('hide');
        this.fillProjects();
      }
    });
  }

  removeProject(projectToDelete, event) {
    event.preventDefault();
    this.db.deleteProject({ projectToDelete }).then(({ err, result }) => {
      if (!err) {
        this.fillProjects();
      }
    });
  }

  close(id) {
    if (id) {
      $('#addEmployeeToProjectModal').modal('hide');
    } else {
      $('#addProjectModal').modal('hide');
    }

  }

  openAddEmpToProjectModal(project) {
    this.employeeToProject.project = project;
    $('#addEmployeeToProjectModal').modal('show');
  }

  selectEmpToProject(empSuggestion) {
    this.employeeToProject.emp = empSuggestion;
    this.employeeToProject.empadd = empSuggestion.firstname + ' ' + empSuggestion.lastname;
    this.employeeToProject.showSuggestions = false;
  }

  filterSuggestions(event) {
    this.employeeToProject.showSuggestions = true;
  }

  getAllocations() {
    this.db.getLists({ entityName: '/allocations' }).then(({ err, result }) => {
      if (!err) {
        this.Allocations = result;
        this.processDate();
      }
    });
  }
  addEmployeeToProject() {
    if (this.employeeToProject.emp && this.employeeToProject.project) {
      this.db.addToProject({
        empid: this.employeeToProject.emp['empid'],
        projectid: this.employeeToProject.project['id'],
        role: this.employeeToProject.role
      }).then(({ err, result }) => {
        if (!err) {
          $('#addEmployeeToProjectModal').modal('hide');
          this.getAllocations();
        }
      });
    }

  }

  removeAllocation(emp, project) {
    if (emp && project) {
      var allocation = this.Allocations.filter((allocation) => {
        if (parseInt(allocation.empid) === parseInt(emp.empid) && parseInt(allocation.projectid) === parseInt(project.id)) {
          return true;
        }
        return false;
      });
      if (allocation.length > 0) {
        allocation = allocation[0];
        this.db.removeFromProject({ id: allocation['id'] }).then(({ err, result }) => {
          this.getAllocations();
        });
      }
    }
  }

}
