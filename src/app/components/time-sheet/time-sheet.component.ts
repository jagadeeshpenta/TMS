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

  calenderDay = 1;
  calenderRows = [1, 2, 3, 4, 5];
  calenderColumns = [1, 2, 3, 4, 5, 6, 7];

  getCalenderDate(cr, cc, project) {
    return {};
  }

  showLoading = true;
  calenderDays = [];
  calenderDate;
  generateCalenderDays(dateToGenerate) {
    var days = [];
    var rows = 5;
    var cols = [1, 2, 3, 4, 5, 6, 0];
    var tDay = new Date(dateToGenerate || this.toDay);
    tDay.setDate(1);
    var dayCount = 0;
    var isDayStarted = false;
    var dayStrtsFrom = tDay.getDay();
    var mnth = tDay.getMonth();
    var wNames = [''];
    for (var r = 0; r < rows; r++) {
      var wdays = [];
      for (var c = 0; c < cols.length; c++) {
        if (r === 0 && cols[c] === dayStrtsFrom && !isDayStarted) {
          isDayStarted = true;
          this.calenderDate = new Date(tDay.getTime());
        }
        var dayData: any = {};
        if (isDayStarted) {
          dayCount = dayCount + 1;
          if (mnth === tDay.getMonth()) {
            dayData.dayCount = dayCount;
            dayData.date = new Date(tDay.getTime());
            tDay.setDate(tDay.getDate() + 1);
          }
        }
        wdays.push(dayData);
      }
      days.push({ days: wdays });
    }
    this.calenderDays = days;
  }

  navigateToCalender(isNext) {
    var dateToGenerate = new Date(this.calenderDate.getTime());
    if (isNext) {
      dateToGenerate.setMonth(dateToGenerate.getMonth() + 1);
    } else {
      dateToGenerate.setMonth(dateToGenerate.getMonth() - 1);
    }
    this.generateCalenderDays(dateToGenerate.getTime());
  }


  weekDays = [];
  monthDays = [];


  serviceData: any = {
    Employees: [],
    Projects: [],
    Allocations: [],
    Timesheets: [],
    Submissions: []
  };

  isWeek = true;

  isMonth = !this.isWeek;
  myProjects = [];
  profile;
  toDay;
  declinecomment = '';
  isManager = false;

  isLoaded = {
    isEmpLoaded: false,
    isProjectsLoaded: false,
    isAllocationsLoaded: false,
    isTimesheetsLoaded: false,
    isSubmissionsLoaded: false,
    userLoaded: false
  };

  MonthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  weekNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  constructor(public db: DBService, public auth: AuthService) {
  }

  waitingForapprovalsLoaded = false;
  approvalProjects = [];
  approvalDays = [];
  approvalWeekDays = [];
  approvalChecked = [];

  getTimeSheetId(project, loggedDate, emp) {
    var empid = emp ? emp.empid : this.profile.empid;
    if (this.serviceData.Timesheets && this.serviceData.Timesheets.length > 0) {
      var timesheetData = this.serviceData.Timesheets.filter((t) => {
        if (t.empid == empid && t.projectid == project.id && t.sheetdate == loggedDate.getDate() && t.sheetmonth == (loggedDate.getMonth() + 1) && t.sheetyear == loggedDate.getFullYear()) {
          return true;
        }
        return false;
      });
      if (timesheetData.length > 0) {
        return timesheetData[0].id;
      }

      return 0;
    }
  }
  updateCheckedData(event, project, tm, dy) {
    var timesheetId = $(event.target).attr('timesheetid');
    if (this.approvalChecked.indexOf(timesheetId) < 0 && $(event.target).is(':checked')) {
      this.approvalChecked.push($(event.target).attr('timesheetid'));
    }

    if (!$(event.target).is(':checked')) {
      if (this.approvalChecked.indexOf(timesheetId.toString()) >= 0) {
        this.approvalChecked.splice(this.approvalChecked.indexOf(timesheetId.toString()), 1);
      }
    }
  }
  isLogSelected(project, loggedDate, emp, approvalChecked) {
    var empid = emp ? emp.empid : this.profile.empid;
    var timesheetId;
    if (this.serviceData.Timesheets && this.serviceData.Timesheets.length > 0) {
      var timesheetData = this.serviceData.Timesheets.filter((t) => {
        if (t.empid == empid && t.projectid == project.id && t.sheetdate == loggedDate.getDate() && t.sheetmonth == (loggedDate.getMonth() + 1) && t.sheetyear == loggedDate.getFullYear()) {
          return true;
        }
        return false;
      });
      if (timesheetData.length > 0) {
        timesheetId = timesheetData[0].id;
      }
      if (timesheetId && approvalChecked.indexOf(timesheetId.toString()) >= 0) {
        return true;
      }
    }
    return false;
  }

  sendMails(idsStr, typ) {
    var ids = idsStr.split(',');
    var updatedTimesheets = [];
    var emailids = [];
    this.serviceData.Timesheets.forEach((t) => {
      if (ids.filter((d) => { return d == t.id }).length > 0) {
        updatedTimesheets.push(t);
        var emps = this.serviceData.Employees.filter((em) => { return em.empid == t.empid });
        if (emps.length > 0) {
          if (emailids.indexOf(emps[0].emailid.replace('@evoketechnologies.com', '')) < 0) {
            emailids.push(emps[0].emailid.replace('@evoketechnologies.com', ''));
          }
        }
      }
    });
    var emailContent = 'Your Timesheet ' + (typ === 'A' ? ' Approved' : 'Declined');
    if (emailids.length > 0) {
      emailids = emailids.length === 1 ? [emailids[0] + '@evoketechnologies.com'] : emailids;
      this.db.sendMail({ toAddress: emailids.join('@evoketechnologies.com,'), text: emailContent, mailContent: emailContent });
    }
  }

  updateStatus(typ) {
    if (typ === 'A') {
      this.db.approveTimesheets({
        sheets: {
          ids: this.approvalChecked.join(','),
          isapproved: true,
        }
      }).then(() => {
        this.db.toastrInstance.success('', 'Timesheet approved', this.db.toastCfg);

        this.sendMails(this.approvalChecked.join(','), typ);
        this.approvalChecked = [];
        this.getData('/timesheets', 'Timesheets', 'isTimesheetsLoaded');
        this.processData();
      });
    } else {
      this.db.approveTimesheets({
        sheets: {
          ids: this.approvalChecked.join(','),
          isapproved: false,
        }
      }).then(() => {
        this.db.toastrInstance.success('', 'Timesheet declined', this.db.toastCfg);
        this.sendMails(this.approvalChecked.join(','), typ);
        this.addTimesheetComment();
        this.closedeclinemodal();
        this.declinecomment = '';
        this.approvalChecked = [];
        this.getData('/timesheets', 'Timesheets', 'isTimesheetsLoaded');
        this.processData();
      });
    }
  }

  addTimesheetComment() {
    var timesheetComment = {
      timesheetids: this.approvalChecked.join(','),
      comment: this.declinecomment
    };
    this.db.makeRequest('/timesheetcomments?lToken=' + this.db.CookieManager.get('lToken'), new this.db.Headers(), timesheetComment, 'POST').then((resp) => {

    });
  }


  processApprovals() {
    if (this.profile.role == 'admin') {
      this.approvalProjects = this.serviceData.Projects;
    } else {
      this.approvalProjects = this.serviceData.Projects.filter((p) => {
        var asManager = this.serviceData.Allocations.filter((a) => {
          if (a.empid == this.profile.empid && a.projectid == p.id && a.role == 'manager') {
            return true;
          }
          return false;
        });
        if (asManager.length > 0) {
          return true;
        }
        return false;
      });
    }
    this.approvalDays = this.generateMonthDays(new Date(this.toDay))
    this.approvalWeekDays = this.generateCurrentWeek(new Date(this.toDay));
    this.waitingForapprovalsLoaded = true;
  }

  getDaysToDisplay(project) {
    //return this.generateMonthDays()
    if (this.isMonth) {
      return this.generateMonthDays(new Date(this.toDay));
    } else {
      return this.generateCurrentWeek(new Date(this.toDay));
    }
  }

  moveApprovalDays(isNext) {
    var ld;
    if (isNext) {
      var daytoGenerate = this.approvalDays[this.approvalDays.length - 1];
      if (this.isWeek) {
        daytoGenerate = this.approvalWeekDays[this.approvalWeekDays.length - 1];
      }
      if (daytoGenerate) {
        ld = new Date(daytoGenerate.getTime());
        ld.setDate(ld.getDate() + 1);
      }
    } else {
      var daytoGenerate = this.approvalDays[0];
      if (this.isWeek) {
        daytoGenerate = this.approvalWeekDays[0];
      }
      if (daytoGenerate) {
        ld = new Date(daytoGenerate.getTime());
        ld.setDate(ld.getDate() - 1);
      }
    }
    if (this.isMonth) {
      this.approvalDays = this.generateMonthDays(ld);
    } else {
      this.approvalWeekDays = this.generateCurrentWeek(ld);
    }
  }

  getTotalHrs(project, emp) {
    var dayToCount = this.isMonth ? this.approvalDays : this.approvalWeekDays;
    if (this.serviceData.Timesheets && this.serviceData.Timesheets.length > 0) {
      var totalHours = 0;
      var timesheetbyempproject = this.serviceData.Timesheets.filter((t) => {
        if (t.empid == emp.empid && t.projectid == project.id) {
          return true;
        }
        return false;
      });

      dayToCount.forEach((w) => {
        var tsheet = timesheetbyempproject.filter((ts) => {
          if (ts.sheetyear == w.getFullYear() && ts.sheetmonth == (w.getMonth() + 1) && ts.sheetdate == w.getDate()) {
            return true;
          }
          return false;
        });

        if (tsheet.length > 0) {
          totalHours = totalHours + parseInt(tsheet[0].loggedhours);
        }
      })
      return totalHours;
    }
    return 0;
  }


  getProjectMembers(project) {
    let members = [];
    members = this.serviceData.Employees.filter((emp) => {
      var ismember = this.serviceData.Allocations.filter((a) => {
        if (a.empid == emp.empid && a.projectid == project.id) {
          return true;
        }
        return false;
      });

      if (ismember.length > 0) {
        return true;
      }
      return false;
    });
    return members;
  }

  processData() {
    this.myProjects = [];
    this.isManager = false;
    if (this.isLoaded.isSubmissionsLoaded && this.isLoaded.userLoaded && this.isLoaded.isEmpLoaded && this.isLoaded.isAllocationsLoaded && this.isLoaded.isProjectsLoaded && this.isLoaded.isTimesheetsLoaded) {
      if (this.serviceData.Projects.length > 0) {
        this.serviceData.Projects.forEach((project) => {
          var alls = this.serviceData.Allocations.filter((a) => {
            if (a.empid == this.profile.empid && a.projectid == project.id && project.id != 1) {
              if (a.role === 'manager') {
                this.isManager = true;
              }
              this.myProjects.push(project);
              return true;
            }
            return false;
          });
        });

        this.myProjects.sort(function (a, b) {
          if (a.id < b.id)
            return 1;
          if (a.id > b.id)
            return -1;
          return 0;
        });

        if (this.myProjects.length > 0) {
          this.myProjects[0].expand = true;
        }

        this.processApprovals();

        this.generateCalenderDays(this.toDay);
      }

      this.showLoading = false
    }
  }

  checkLogHours(project, loggedDate, emp) {
    var empid = emp ? emp.empid : this.profile.empid;
    if (this.serviceData.Timesheets && this.serviceData.Timesheets.length > 0) {
      var timesheetData = this.serviceData.Timesheets.filter((t) => {
        if (t.empid == empid && t.projectid == project.id && t.sheetdate == loggedDate.getDate() && t.sheetmonth == (loggedDate.getMonth() + 1) && t.sheetyear == loggedDate.getFullYear()) {
          return true;
        }
        return false;
      });
      if (timesheetData.length > 0) {
        return true
      }
    }
    return false;
  }
  getLoggedHours(project, loggedDate, emp) {
    var empid = emp ? emp.empid : this.profile.empid;
    if (this.serviceData.Timesheets && this.serviceData.Timesheets.length > 0) {
      var timesheetData = this.serviceData.Timesheets.filter((t) => {
        if (t.empid == empid && t.projectid == project.id && t.sheetdate == loggedDate.getDate() && t.sheetmonth == (loggedDate.getMonth() + 1) && t.sheetyear == loggedDate.getFullYear()) {
          return true;
        }
        return false;
      });
      if (timesheetData.length > 0) {
        return timesheetData[0].loggedhours;
      }
    }
    return '-';
  }

  getLoggedClass(project, loggedDate, emp) {
    var classHash = { submitted: false, approved: false, pending: false, declined: false };

    var empToCheck = emp || this.profile;
    var empid = emp ? emp.empid : this.profile.empid;
    if (this.serviceData.Timesheets && this.serviceData.Timesheets.length > 0) {
      var timesheetData = this.serviceData.Timesheets.filter((t) => {
        if (t.empid == empid && t.projectid == project.id && t.sheetdate == loggedDate.getDate() && t.sheetmonth == (loggedDate.getMonth() + 1) && t.sheetyear == loggedDate.getFullYear()) {
          return true;
        }
        return false;
      });
      if (timesheetData.length > 0) {
        var timesheet = timesheetData[0];
        if (timesheetData[0].isapproved && parseInt(timesheetData[0].declinedcount) === 0) {
          classHash.approved = true;
        }

        if (timesheetData[0].isapproved == false && parseInt(timesheetData[0].declinedcount) > 0) {
          classHash.declined = true;
        }

        if (!timesheet.approved && !timesheet.declined) {
          classHash.pending = true;
        }
      }
    }
    classHash.submitted = this.isDisabled(project, loggedDate, empToCheck);
    return classHash;
  }
  getLoggedData(project, loggedDate, emp) {
    var empToCheck = emp || this.profile;
    var empid = emp ? emp.empid : this.profile.empid;
    var timesheet = { submitted: false, approved: false, pending: false, logged: false, declined: false };
    if (this.serviceData.Timesheets && this.serviceData.Timesheets.length > 0) {
      var timesheetData = this.serviceData.Timesheets.filter((t) => {
        if (t.empid == empid && t.projectid == project.id && t.sheetdate == loggedDate.getDate() && t.sheetmonth == (loggedDate.getMonth() + 1) && t.sheetyear == loggedDate.getFullYear()) {
          return true;
        }
        return false;
      });
      if (timesheetData.length > 0) {
        timesheet = timesheetData[0];
        timesheet.logged = true;
        if (timesheetData[0].isapproved && parseInt(timesheetData[0].declinedcount) === 0) {
          timesheet.approved = true;
        }

        if (timesheetData[0].isapproved == false && parseInt(timesheetData[0].declinedcount) > 0) {
          timesheet.declined = true;
        }

        if (!timesheet.approved && !timesheet.declined) {
          timesheet.pending = true;
        }
      }
    }
    timesheet.submitted = this.isDisabled(project, loggedDate, empToCheck);
    return timesheet;
  }

  isApproved(project, loggedDate, emp) {
    var empid = emp ? emp.empid : this.profile.empid;
    if (this.serviceData.Timesheets && this.serviceData.Timesheets.length > 0) {
      var timesheetData = this.serviceData.Timesheets.filter((t) => {
        if (t.empid == empid && t.projectid == project.id && t.sheetdate == loggedDate.getDate() && t.sheetmonth == (loggedDate.getMonth() + 1) && t.sheetyear == loggedDate.getFullYear()) {
          return true;
        }
        return false;
      });
      if (timesheetData.length > 0 && timesheetData[0].isapproved == true) {
        return true;
      }
    }
    return false;
  }

  isDisabled(project, loggedDate, emp) {
    var empid = emp ? emp.empid : this.profile.empid;
    if (this.serviceData.Submissions && this.serviceData.Submissions.length > 0) {
      var isSubmitted = false;
      for (let i = 0, len = this.serviceData.Submissions.length; i < len; i++) {
        let sub = this.serviceData.Submissions[i];
        if (sub.subyear == loggedDate.getFullYear() && sub.submonth == loggedDate.getMonth() && sub.empid == empid && sub.pid == project.id) {
          isSubmitted = true;
          break;
        }
      }
      if (isSubmitted) {
        return true;
      }
    }
    return false;
  }

  getStatus(project, loggedDate, emp) {
    var empid = emp ? emp.empid : this.profile.empid;
    if (this.serviceData.Timesheets && this.serviceData.Timesheets.length > 0) {
      var timesheetData = this.serviceData.Timesheets.filter((t) => {
        if (t.empid == empid && t.projectid == project.id && t.sheetdate == loggedDate.getDate() && t.sheetmonth == (loggedDate.getMonth() + 1) && t.sheetyear == loggedDate.getFullYear()) {
          return true;
        }
        return false;
      });
      if (timesheetData.length > 0) {
        return timesheetData[0].isapproved && parseInt(timesheetData[0].declinedcount) === 0 ? 'approved' : (parseInt(timesheetData[0].declinedcount) > 0 ? 'declined' : 'default');
      }
    }
    return 'default';
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

  refreshData() {
    this.isLoaded.isEmpLoaded = false;
    this.isLoaded.isProjectsLoaded = false;
    this.isLoaded.isAllocationsLoaded = false;
    this.isLoaded.isTimesheetsLoaded = false;
    this.isLoaded.isSubmissionsLoaded = false;

    this.getData('/employees', 'Employees', 'isEmpLoaded');
    this.getData('/projects', 'Projects', 'isProjectsLoaded');
    this.getData('/allocations', 'Allocations', 'isAllocationsLoaded');
    this.getData('/timesheets', 'Timesheets', 'isTimesheetsLoaded');
    this.getData('/submissions', 'Submissions', 'isSubmissionsLoaded');
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
        this.getData('/submissions', 'Submissions', 'isSubmissionsLoaded');

        if (this.toDay) {
          this.weekDays = this.generateCurrentWeek(new Date(this.toDay));
          this.monthDays = this.generateMonthDays(new Date(this.toDay));
        }
      } else {
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

  navigateToMonth(isNext) {
    var ld;
    if (isNext) {
      var daytoGenerate = this.monthDays[this.monthDays.length - 1];
      if (daytoGenerate) {
        ld = new Date(daytoGenerate.getTime());
        ld.setDate(ld.getDate() + 1);
      }
    } else {
      var daytoGenerate = this.monthDays[0];
      if (daytoGenerate) {
        ld = new Date(daytoGenerate.getTime());
        ld.setDate(ld.getDate() - 1);
      }
    }
    if (ld) {
      var monthDays = this.generateMonthDays(ld);
      this.monthDays = monthDays;
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
  closedeclinemodal() {
    $('#declineCommentModal').modal('hide');
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

      this.db.toastrInstance.success('', 'Timesheet Log Updated', this.db.toastCfg);

      if (!err) {
        this.getData('/timesheets', 'Timesheets', 'isTimesheetsLoaded');
        this.processData();
      }
    });

  }

  checktimesheetsubmision(project, loggedDate, emp) {
    var empid = emp ? emp.empid : this.profile.empid;
    var issub = false, isapproved = false, isdeclined = false;
    if (this.serviceData.Submissions && this.serviceData.Submissions.length > 0) {
      var isSubmitted = false;
      for (let i = 0, len = this.serviceData.Submissions.length; i < len; i++) {
        let sub = this.serviceData.Submissions[i];
        if (sub.subyear == loggedDate.getFullYear() && sub.submonth == loggedDate.getMonth() && sub.empid == empid && sub.pid == project.id) {
          isSubmitted = true;
          break;
        }
      }
      if (isSubmitted) {
        issub = true;
      }
    }

    if (this.serviceData.Timesheets && this.serviceData.Timesheets.length > 0) {
      var timesheetData = this.serviceData.Timesheets.filter((t) => {
        if (t.empid == empid && t.projectid == project.id && t.sheetdate == loggedDate.getDate() && t.sheetmonth == (loggedDate.getMonth() + 1) && t.sheetyear == loggedDate.getFullYear()) {
          return true;
        }
        return false;
      });
      if (timesheetData.length > 0) {
        if (timesheetData[0].isapproved == true) {
          isapproved = true;
        } else {
          isdeclined = true;
        }
      }
    }

    if (issub) {
      if (isdeclined) {
        return false;
      }
      return true;
    } else {
      if (isapproved) {
        return true;
      }
    }

    return false;
  }


  isTimesheetSubmited = 'Submit';
  checktimesheetsubmisionall(projects, loggedDate, emp) {
    this.isTimesheetSubmited = 'Submit';
    var empid = emp ? emp.empid : this.profile.empid;
    var issub = false, isapproved = false, isdeclined = false;
    projects.forEach((p) => {
      if (this.serviceData.Submissions && this.serviceData.Submissions.length > 0) {
        var isSubmitted = false;
        for (let i = 0, len = this.serviceData.Submissions.length; i < len; i++) {
          let sub = this.serviceData.Submissions[i];
          if (sub.subyear == loggedDate.getFullYear() && sub.submonth == loggedDate.getMonth() && sub.empid == empid && sub.pid == p.id) {
            isSubmitted = true;
            break;
          }
        }
        if (isSubmitted) {
          issub = true;
        }
      }
      this.serviceData.Timesheets.forEach((t) => {
        if (t.empid == empid && t.projectid == p.id && t.sheetmonth == (loggedDate.getMonth() + 1) && t.sheetyear == loggedDate.getFullYear()) {
          if (!t.isapproved) {
            isdeclined = true;
          }
          return true;
        }
        return false;
      });
    });


    if (issub) {
      this.isTimesheetSubmited = 'Re submit';
      if (isdeclined) {
        return false;
      }
      return true;
    } else {
      if (isapproved) {
        return true;
      }
    }

    return false;
  }

  submittimesheets(project) {
    var submonth = this.monthDays[0].getMonth();
    var subyear = this.monthDays[0].getFullYear();

    // var projectsToSubmit = this.myProjects.map((p) => p.id).join(',');
    var projectsToSubmit = project.id.toString();
    var empid = this.profile.empid;
    var submisionData = {
      submonth,
      subyear,
      empid,
      subcount: 1,
      pid: projectsToSubmit
    };

    var managers = [];
    this.serviceData.Allocations.forEach(a => {
      if (a.projectid == project.id && a.role == 'manager') {
        var emp = this.serviceData.Employees.filter(e => { return e.empid == a.empid; });
        if (emp.length > 0) {
          managers.push(emp[0]);
        }
      }
    });
    var emailids = [];
    if (managers.length > 0) {
      emailids = managers.reduce((a, b) => {
        return a.concat(b.emailid.replace('@evoketechnologies.com', ''));
      }, []);
    } else {
      emailids = this.serviceData.Employees.filter(e => { return e.role == 'admin'; }).reduce((a, b) => {
        return a.concat(b.emailid.replace('@evoketechnologies.com', ''));
      }, []);
    }

    if (emailids.length === 1) {
      emailids[0] = emailids[0] + '@evoketechnologies.com';
    }


    var timesheetsToAdd = [];

    var projectTimesheets = this.serviceData.Timesheets.filter(t => { return t.projectid == project.id && t.empid == this.profile.empid; });
    this.calenderDays.forEach(cr => {
      cr.days.forEach(cc => {
        if (cc.date) {
          var filterSheets = projectTimesheets.filter(t => { if (t.sheetdate === cc.date.getDate() && t.sheetmonth == (cc.date.getMonth() + 1) && t.sheetyear === cc.date.getFullYear()) { return true; } return false; });
          if (filterSheets.length === 0) {
            timesheetsToAdd.push({
              empid: empid,
              projectid: project.id,
              loggedhours: 0,
              timesheetdate: this.getHtml5DateFormat(cc.date)
            });
          } else {
            if (filterSheets[0]) {
              timesheetsToAdd.push({
                id: filterSheets[0].id,
                empid: empid,
                projectid: project.id,
                loggedhours: filterSheets[0].loggedhours,
                timesheetdate: this.getHtml5DateFormat(cc.date)
              });
            }

          }
        }
      });
    });


    this.db.makeRequest('/bulktimesheets?lToken=' + this.db.CookieManager.get('lToken'), new this.db.Headers(), { sheets: timesheetsToAdd }, 'POST').then((resp) => {

    });


    this.db.makeRequest('/submissions?lToken=' + this.db.CookieManager.get('lToken'), new this.db.Headers(), submisionData, 'POST').then((resp) => {

      this.refreshData();
      var emailContent = 'Project (' + project.name + ') - Timesheet (' + this.MonthNames[submonth] + ', ' + subyear + ') are waiting for you approval';
      this.db.sendMail({ toAddress: emailids.join('@evoketechnologies.com,'), text: emailContent, mailContent: emailContent });
    });
 
  }

}
