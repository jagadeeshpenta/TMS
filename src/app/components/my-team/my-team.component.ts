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

  MonthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  employeeToProject = {
    project: {},
    empadd: '',
    role: 'member',
    emp: {},
    showSuggestions: false,
    onSubmit: false,
    isbillable: true,
    reportingto: '',
    subteam: ''
  };

  profile = {};
  showDropDownBox;
  Projects = [];
  Employees = [];
  Allocations = [];
  EmployeeSuggestions = [];

  allocationLoaded = false;
  employeesLoaded = false;

  projectsProcessed = false;
  editProject = false;
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
    console.log('profile', this.profile);
    if (this.allocationLoaded && this.employeesLoaded && this.profile) {
      if (this.Projects.length > 0) {
        this.Projects.forEach((project) => {
          var empofProjects = [];
          this.Employees.forEach((em) => {
            var alls = this.Allocations.filter((a) => {
              if (a.projectid == project.id && a.empid == em.empid) {
                return true;
              }
              return false;
            });
            if (alls.length > 0) {
              em.role = alls[0].role;
              em.allocationid = alls[0].id;
              empofProjects.push(em);
            }
          });

          project.Employees = empofProjects;
        });

        var myProjects = this.Projects.filter(p => {
          var alls = this.Allocations.filter((a) => {
            if (a.projectid == p.id && a.empid == this.profile['empid']) {
              return true;
            }
            return false;
          });
          
          if(this.profile['role']=== 'admin'){
            return true;
          }

          if (alls.length > 0 && alls[0].role === 'manager') {
            return true;
          }
          return false;
        });

        this.projectsProcessed = true;
      }

    }
  }

  getAllocationType(projectid, empid) {
    var allocs = this.Allocations.filter((a) => {
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
        this.db.toastrInstance.success('', 'Project added successfully', this.db.toastCfg);
      }
    });
  }

  removeProject(projectToDelete, event) {
    event.preventDefault();
    this.db.deleteProject({ projectToDelete }).then(({ err, result }) => {
      if (!err) {
        this.fillProjects();
        this.db.toastrInstance.success('', 'Project removed successfully', this.db.toastCfg);
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
    this.employeeToProject.onSubmit = false;
    this.employeeToProject.showSuggestions = false;
    this.employeeToProject.empadd = '';
    this.employeeToProject.emp = {};
    this.employeeToProject.isbillable = true;
    $('#addEmployeeToProjectModal').modal('show');
  }

  selectEmpToProject(empSuggestion) {
    this.employeeToProject.emp = empSuggestion;
    this.employeeToProject.empadd = empSuggestion.firstname + ' ' + empSuggestion.lastname;
    this.employeeToProject.showSuggestions = false;
  }

  filterSuggestions(event) {
    this.employeeToProject.showSuggestions = true;
    this.employeeToProject.emp = {};
    var suitableEmps = [],
      project: any = this.employeeToProject.project;
    if (project.id) {
      suitableEmps = this.Employees.filter((emp) => {
        var alcos = this.Allocations.filter((a) => { return (a.empid == emp.empid && a.projectid == project.id) ? true : false; });
        if (alcos.length > 0) {
          return false;
        }
        return true;
      });
    }
    this.EmployeeSuggestions = suitableEmps;
  }
  getSuggestions(project) {

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
    this.employeeToProject.onSubmit = true;
    if (this.employeeToProject.emp && this.employeeToProject.emp['empid'] && this.employeeToProject.project) {
      this.db.addToProject({
        empid: this.employeeToProject.emp['empid'],
        projectid: this.employeeToProject.project['id'],
        role: this.employeeToProject.role,
        isbillable: this.employeeToProject.isbillable
      }).then(({ err, result }) => {
        if (!err) {
          this.db.toastrInstance.success('', 'Employee added to project successfully', this.db.toastCfg);
          this.employeeToProject.project = {};
          this.employeeToProject.showSuggestions = false;
          this.employeeToProject.empadd = '';
          this.employeeToProject.emp = {};
          $('#addEmployeeToProjectModal').modal('hide');
          this.getAllocations();
        } else {
          this.db.toastrInstance.error('', 'Failed to add employee to project.', this.db.toastCfg);
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
          this.db.toastrInstance.success('', 'Employee removed from project successfully', this.db.toastCfg);
          this.getAllocations();
        });
      }
    }
  }

  showDropdown() {
    this.showDropDownBox = true;
  }

  cancelDropDown() {
    this.showDropDownBox = false;
  }

  saveRoles(project, emp) {
    this.db.addToProject({ id: emp.allocationid, role: emp.role, empid: emp.empid, projectid: project.id }).then(() => {
      this.allocationLoaded = false;
      this.employeesLoaded = false;
      this.getAllocationsandEmployees();
    });
  }

  getHtml5DateFormat(dy) {
    var formateTo2digit = (mnth) => {
      if (mnth < 10) {
        return `0${mnth}`;
      } else {
        return `${mnth}`;
      }
    };
    return dy.getFullYear() + '-' + formateTo2digit(dy.getMonth() + 1) + '-' + formateTo2digit(dy.getDate());
  }

  EditProject(project) {
    project.editProject = true;
    project.editName = project.name;
    if (project.actualstartdate) {
      project.editStartDate = this.getHtml5DateFormat(new Date(project.actualstartdate));
    }
    if (project.actualenddate) {
      project.editEndDate = this.getHtml5DateFormat(new Date(project.actualenddate));
    }
  }

  saveEditProject(project) {
    //console.log(project);
    this.db.editProject(project).then(({ err, result }) => {
      if (!err) {
        this.fillProjects();
      }
    });
  }

  getDisplayDateFormat(timeStamp) {
    if (timeStamp) {
      var tmp = new Date(timeStamp);
      return tmp.getDate() + ' ' + this.MonthNames[tmp.getMonth()] + ',' + tmp.getFullYear();
    } else {
      return '';
    }
  }
}
