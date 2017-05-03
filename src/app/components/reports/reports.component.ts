import { Component, OnInit, Input } from '@angular/core';
import { DBService } from './../../Shared/dbservice';
import { AuthService } from './../../Shared/auth/auth.service';
declare var $: any;
@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

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
    userLoaded: false,
    readyToRender: false
  };



  constructor(public db: DBService, public auth: AuthService) { }

  processData() {
    this.myProjects = [];
    if (this.isLoaded.userLoaded && this.isLoaded.isEmpLoaded && this.isLoaded.isAllocationsLoaded && this.isLoaded.isProjectsLoaded && this.isLoaded.isTimesheetsLoaded) {
      if (this.serviceData.Projects.length > 0) {
        this.serviceData.Projects.map((project) => {
          project.isWeek = false;
          project.isMonth = !project.isWeek;
          project.weekToDisplay = this.generateCurrentWeek(new Date(this.toDay));
          project.monthToDisplay = this.generateMonthDays(new Date(this.toDay));
        });
      }
      this.isLoaded.readyToRender = true;
    }
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
      }
    });
  }

  getAllocationsOfProject(project) {
    var allocations = [];
    this.serviceData.Allocations.forEach((a) => {
      if (a.projectid == project.id) {
        var emp = this.getEmployeeByEmpId(a.empid);
        if (emp && emp.id) {
          a.emp = emp;
          allocations.push(a);
        }
      }
    });
    if (allocations.length > 0) {
      return allocations;
    }
    return [];
  }



  empCache = {};
  getEmployeeByEmpId(empid) {
    if (empid && this.empCache['E' + empid]) {
      return this.empCache['E' + empid]
    } else {
      var emps = this.serviceData.Employees.filter((emp) => {
        if (emp.empid == empid) {
          return true;
        }
        return false;
      });
      if (emps.length > 0) {
        this.empCache['E' + empid] = emps[0];
        return this.empCache['E' + empid]
      }
      return {};
    }
  }

  MonthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  weekNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  navigateToWeek(project, isNext) {
    var ld;
    if (isNext) {
      var daytoGenerate = project.weekToDisplay[project.weekToDisplay.length - 1];
      if (daytoGenerate) {
        ld = new Date(daytoGenerate.getTime());
        ld.setDate(ld.getDate() + 1);
      }
    } else {
      var daytoGenerate = project.weekToDisplay[0];
      if (daytoGenerate) {
        ld = new Date(daytoGenerate.getTime());
        ld.setDate(ld.getDate() - 1);
      }
    }
    if (ld) {
      var nextWeek = this.generateCurrentWeek(ld);
      project.weekToDisplay = nextWeek;
    }
  }

  navigateToMonth(project, isNext) {
    var ld;
    if (isNext) {
      var daytoGenerate = project.monthToDisplay[project.monthToDisplay.length - 1];
      if (daytoGenerate) {
        ld = new Date(daytoGenerate.getTime());
        ld.setDate(ld.getDate() + 1);
      }
    } else {
      var daytoGenerate = project.monthToDisplay[0];
      if (daytoGenerate) {
        ld = new Date(daytoGenerate.getTime());
        ld.setDate(ld.getDate() - 1);
      }
    }
    if (ld) {
      var days = this.generateMonthDays(ld);
      project.monthToDisplay = days;
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

  generateMonthDays(dateToGenerate) {
    var daysToReturn = [];
    var tDate = dateToGenerate;
    if (dateToGenerate instanceof Date) {
      tDate = dateToGenerate.getTime();
    }
    tDate = new Date(tDate);

    var crntMonth = tDate.getMonth();
    var crntYr = tDate.getFullYear();
    var frmDate = new Date(crntYr, crntMonth, 1);
    for (let i = 0; i < 31; i++) {
      var tmpDate = new Date(frmDate.getTime());
      tmpDate.setDate(tmpDate.getDate() + (i * 1));
      if (tmpDate.getMonth() === frmDate.getMonth()) {
        daysToReturn.push(new Date(tmpDate.getTime()));
      }
    }

    return daysToReturn;
  }


  getLoggedHours(project, loggedDate, emp) {
    if (this.serviceData.Timesheets && this.serviceData.Timesheets.length > 0) {
      var timesheetData = this.serviceData.Timesheets.filter((t) => {
        if (t.empid == emp.empid && t.projectid == project.id && t.sheetdate == loggedDate.getDate() && t.sheetmonth == (loggedDate.getMonth() + 1) && t.sheetyear == loggedDate.getFullYear()) {
          return true;
        }
        return false;
      });
      if (timesheetData.length > 0) {
        if (timesheetData[0].isapproved && timesheetData[0].declinedcount == 0) {
          return timesheetData[0].loggedhours;
        } else {
          return '-';
        }
      }
    }
    return '-';
  }

  getWeekTotalHours(project, weekToCount, emp) {
    if (this.serviceData.Timesheets && this.serviceData.Timesheets.length > 0) {
      var totalHours = 0;
      var timesheetbyempproject = this.serviceData.Timesheets.filter((t) => {
        if (t.empid == emp.empid && t.projectid == project.id) {
          return true;
        }
        return false;
      });

      weekToCount.forEach((w) => {
        var tsheet = timesheetbyempproject.filter((ts) => {
          if (ts.sheetyear == w.getFullYear() && ts.sheetmonth == (w.getMonth() + 1) && ts.sheetdate == w.getDate()) {
            return true;
          }
          return false;
        });

        if (tsheet.length > 0) {
          if (tsheet[0].isapproved && tsheet[0].declinedcount == 0) {
            totalHours = totalHours + parseInt(tsheet[0].loggedhours);
          }
        }
      })
      return totalHours;
    }
    return 0;
  }
  generateDates(sDate, eDate){
   var strtDate = new Date(sDate);
   var endDate = new Date(eDate);
   var daysToGenerate = [];
   for(var i = 0; i < 100; i++){
   var tmpDate = new Date(strtDate.getTime());
   tmpDate.setDate(tmpDate.getDate() + i);
   daysToGenerate.push(new Date(tmpDate.getTime()));
    if (tmpDate.getFullYear() == endDate.getFullYear() && tmpDate.getMonth() == endDate.getMonth() && tmpDate.getDate() == endDate.getDate()){
    break;
    }
    
   }  
  return daysToGenerate;
  }

  generateXls(project){
    $("#xlstable").table2excel({
        exclude: ".noExl",
        name: "Excel Document Name",
        filename: project.name.replace(' ', '-') +"-Reports",
        fileext: ".xls",
        exclude_img: true,
        exclude_links: true,
        exclude_inputs: true
    });
  }
}
