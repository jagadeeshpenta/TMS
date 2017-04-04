import { Component, OnInit } from '@angular/core';
import { DBService } from './../../Shared/dbservice';
import { AuthService } from './../../Shared/auth/auth.service';

declare var $: any;

@Component({
  selector: 'app-time-sheet',
  templateUrl: './time-sheet.component.html',
  styleUrls: ['./time-sheet.component.scss']
})
export class TimeSheetComponent implements OnInit {

  weekDays = [];
  serviceData: any = {
    Employees: [],
    Projects: [],
    Allocations: [],
    Timesheets: []
  };

  myProjects = [];
  profile;
  toDay;

  isLoaded = {
    isEmpLoaded: false,
    isProjectsLoaded: false,
    isAllocationsLoaded: false,
    isTimesheetsLoaded: false,
    userLoaded: false
  };

  MonthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  weekNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  constructor(public db: DBService, public auth: AuthService) {

  }

  processData() {
    this.myProjects = [];
    if (this.isLoaded.userLoaded && this.isLoaded.isEmpLoaded && this.isLoaded.isAllocationsLoaded && this.isLoaded.isProjectsLoaded && this.isLoaded.isTimesheetsLoaded) {
      if (this.serviceData.Projects.length > 0) {
        this.serviceData.Projects.forEach((project) => {
          var alls = this.serviceData.Allocations.filter((a) => {
            if (a.empid == this.profile.empid && a.projectid == project.id) {
              this.myProjects.push(project);
              return true;
            }
            return false;
          });
        });
      }
    }
  }

  getLoggedHours(project, loggedDate) {
    if (this.serviceData.Timesheets && this.serviceData.Timesheets.length > 0) {
      var timesheetData = this.serviceData.Timesheets.filter((t) => {
        if (t.empid == this.profile.empid && t.projectid == project.id && t.sheetdate == loggedDate.getDate() && t.sheetmonth == (loggedDate.getMonth() + 1) && t.sheetyear == loggedDate.getFullYear()) {
          return true;
        }
        return false;
      });
      if (timesheetData.length > 0) {
        return timesheetData[0].loggedhours;
      }
    }
    return 0;
  }


  getData(entityName, dataName, loadedName) {
    this.db.getLists({ entityName: entityName }).then(({ err, result }) => {
      if (!err) {
        this.isLoaded[loadedName] = true;
        this.serviceData[dataName] = result;
        this.processData();
      }
    });
  }

  ngOnInit() {
    this.auth.checkUser().then(({ err, result }) => {
      if (result && result.profile) {
        this.profile = result.profile;
        this.toDay = result.toDay;
        this.isLoaded.userLoaded = true;
        this.getData('/employees', 'Employees', 'isEmpLoaded');
        this.getData('/projects', 'Projects', 'isProjectsLoaded');
        this.getData('/allocations', 'Allocations', 'isAllocationsLoaded');
        this.getData('/timesheets', 'Timesheets', 'isTimesheetsLoaded');

        if (this.toDay) {
          this.weekDays = this.generateCurrentWeek(new Date(this.toDay));
        }
      }
    });

  }

  navigateToWeek(isNext) {
    var ld;
    if (isNext) {
      var daytoGenerate = this.weekDays[this.weekDays.length - 1];
      if (daytoGenerate) {
        ld = new Date(daytoGenerate.getTime());
        ld.setDate(ld.getDate() + 1);
      }
    } else {
      var daytoGenerate = this.weekDays[0];
      if (daytoGenerate) {
        ld = new Date(daytoGenerate.getTime());
        ld.setDate(ld.getDate() - 1);
      }
    }
    if (ld) {
      var nextWeek = this.generateCurrentWeek(ld);
      this.weekDays = nextWeek;
    }
  }

  generateCurrentWeek(dateToGenerate) {
    var tDate = dateToGenerate,
      weekHash = {
        "Mon": null,
        "Tue": null,
        "Wed": null,
        "Thu": null,
        "Fri": null,
        "Sat": null,
        "Sun": null,
      },
      days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      sNo = 0;
    if (dateToGenerate instanceof Date) {
      tDate = dateToGenerate.getTime();
    }
    tDate = new Date(tDate);

    switch (tDate.getDay()) {
      case 1:
        sNo = 0;
        break;
      case 2:
        sNo = -1;
        break;
      case 3:
        sNo = -2;
        break;
      case 4:
        sNo = -3;
        break;
      case 5:
        sNo = -4;
        break;
      case 0:
        sNo = -6;
        break;
      case 6:
        sNo = -5;
        break;
      default:
        break;
    }
    for (var i = 0; i <= 6; i++ , sNo++) {
      var tmpDate = new Date(tDate.getTime());
      tmpDate.setDate(tmpDate.getDate() + sNo);
      tmpDate = new Date(tmpDate);
      weekHash[days[tmpDate.getDay()]] = tmpDate;
    }

    var orderofDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    var daysToReturn = [];
    orderofDays.forEach((dy) => {
      daysToReturn.push(weekHash[dy]);
    });

    return daysToReturn;
  }



  logModalData = {
    project: {
      id: 0
    },
    timesheetdate: {},
    ispreload: false,
    loggedhours: 0,
    timesheetid: 0
  };
  openLogWorkmodal(project, dy) {
    this.logModalData.project = project;
    this.logModalData.timesheetdate = this.getHtml5DateFormat(dy);
    this.logModalData.ispreload = true;
    var timesheetData = this.serviceData.Timesheets.filter((t) => {
      if (t.empid == this.profile.empid && t.projectid == project.id && t.sheetdate == dy.getDate() && t.sheetmonth == (dy.getMonth() + 1) && t.sheetyear == dy.getFullYear()) {
        return true;
      }
      return false;
    });

    if (timesheetData.length > 0) {
      this.logModalData.loggedhours = timesheetData[0].loggedhours || 0;
      this.logModalData.timesheetid = timesheetData[0].id;
    } else {
      this.logModalData.timesheetid = 0;
      this.logModalData.loggedhours = 0
    }
    $('#logWorkModal').modal('show');
  }

  close() {
    $('#logWorkModal').modal('hide');
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

  logWork() {
    this.db.addTimesheet({
      empid: this.profile.empid,
      projectid: this.logModalData.project.id,
      loggedhours: this.logModalData.loggedhours,
      timesheetdate: this.logModalData.timesheetdate,
      id: this.logModalData.timesheetid
    }).then(({ err, result }) => {
      $('#logWorkModal').modal('hide');
      this.logModalData.ispreload = false;
      this.logModalData.timesheetdate = this.getHtml5DateFormat(new Date());
      if (!err) {
        this.getData('/timesheets', 'Timesheets', 'isTimesheetsLoaded');
        this.processData();
      }
    });

  }

}
