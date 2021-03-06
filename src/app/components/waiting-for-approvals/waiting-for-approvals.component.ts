import { Component, OnInit } from '@angular/core';
import { DBService } from './../../Shared/dbservice';
import { AuthService } from './../../Shared/auth/auth.service';

<<<<<<< HEAD
=======
import { Router, ActivatedRoute } from '@angular/router';

>>>>>>> 265bccdb00a782de5c3d5ad900c32bb6bf2b3a5f
declare var $: any;

@Component({
  selector: 'waiting-for-approvals',
  templateUrl: './waiting-for-approvals.component.html',
  styleUrls: ['./waiting-for-approvals.component.scss']
})
export class WaitingForApprovalsComponent implements OnInit {


<<<<<<< HEAD
  weekDays = [];
  monthDays = [];


=======
  allchecked = {

  };
  weekDays = [];
  monthDays = [];

  projectID;
>>>>>>> 265bccdb00a782de5c3d5ad900c32bb6bf2b3a5f
  serviceData: any = {
    Employees: [],
    Projects: [],
    Allocations: [],
    Timesheets: [],
    Submissions: []
  };

  isWeek = false;

  isMonth = !this.isWeek;
  myProjects = [];
  profile;
  toDay;
  declinecomment = '';

  isLoaded = {
    isEmpLoaded: false,
    isProjectsLoaded: false,
    isAllocationsLoaded: false,
    isTimesheetsLoaded: false,
    isSubmissionsLoaded: false,
    userLoaded: false
  };

  waitingForapprovalsLoaded = false;
  approvalProjects = [];
  approvalDays = [];
  approvalWeekDays = [];
  approvalChecked = [];
  approvalsubmissions = [];


  MonthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  weekNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
<<<<<<< HEAD
  constructor(public db: DBService, public auth: AuthService) {
  }

  moveApprovalDays(isNext) {
=======
  constructor(public db: DBService, public auth: AuthService, private route: ActivatedRoute, private router: Router) {
  }

  isSheetSubmitted(project, tm, approvalDays) {
    var timesheets = [];

    var projectTimesheets = this.serviceData.Timesheets.filter(t => { return t.projectid == project.id && t.empid == tm.empid; });
    approvalDays.forEach(dy => {
      if (projectTimesheets.filter(t => { if (t.sheetdate === dy.getDate() && t.sheetmonth == (dy.getMonth() + 1) && t.sheetyear === dy.getFullYear()) { return true; } return false; }).length > 0) {
        timesheets.push({
          empid: tm.empid,
          projectid: project.id,
          submonth: dy.getMonth(),
          subyear: dy.getFullYear()
        })
      }
    });

    if (timesheets.length === 0) {
      var mnthToCheck = this.approvalDays[0].getMonth().toString();
      var yearToCheck = this.approvalDays[0].getFullYear().toString();
      var submisionchecked = false;
      this.serviceData.Submissions.forEach(s => {
        if (s.pid == project.id && s.empid == tm.empid && s.submonth == mnthToCheck && s.subyear == yearToCheck) {
          if (this.approvalsubmissions.indexOf(s.id.toString()) >= 0) {
            submisionchecked = true;
          }
        }
      });

      if (submisionchecked) {
        return true;
      }
    } else {
      return true;
    }
    return false;
  }

  moveApprovalDays(isNext) {
    Object.keys(this.allchecked).forEach(k => {
      for (var emp in this.allchecked[k]) {
        this.allchecked[k][emp] = false;
      }
    });

>>>>>>> 265bccdb00a782de5c3d5ad900c32bb6bf2b3a5f
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
    this.approvalDays = this.generateMonthDays(ld);
  }
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

  isAllSelected(project, tm, approvalChecked, approvalsubmissions) {
    var tcount = 0, tSelected = 0;
    var isateastonetimesheet = false;
    this.approvalDays.forEach(a => {
      var timesheetData = this.serviceData.Timesheets.filter((t) => {
        if (t.empid == tm.empid && t.projectid == project.id && t.sheetdate == a.getDate() && t.sheetmonth == (a.getMonth() + 1) && t.sheetyear == a.getFullYear()) {
          return true;
        }
        return false;
      });
      if (timesheetData.length > 0) {
        isateastonetimesheet = true;
        if (timesheetData[0].id) {
          var timesheetId = timesheetData[0].id;
          tcount = tcount + 1;
          if (this.approvalChecked.indexOf(timesheetId.toString()) >= 0) {
            tSelected = tSelected + 1;
          }
        }
      }
    });
    if (!isateastonetimesheet) {
      var mnthToCheck = this.approvalDays[0].getMonth().toString();
      var yearToCheck = this.approvalDays[0].getFullYear().toString();
      var submisionchecked = false;
      this.serviceData.Submissions.forEach(s => {
        if (s.pid == project.id && s.empid == tm.empid && s.submonth == mnthToCheck && s.subyear == yearToCheck) {
          if (this.approvalsubmissions.indexOf(s.id.toString()) >= 0) {
            submisionchecked = true;
          }
        }
      });
      if (submisionchecked) {
        return true;
      }
      return false;
    }
    return tcount === tSelected;
  }

  selectAllTimesheets(event, project, tm) {
<<<<<<< HEAD
=======

    if (this.allchecked['P' + project.id]) {
      this.allchecked['P' + project.id]['E' + tm.empid] = true;
    }

>>>>>>> 265bccdb00a782de5c3d5ad900c32bb6bf2b3a5f
    var timesheets = [];
    var atleastonesheet = false;
    this.approvalDays.forEach(a => {
      var timesheetData = this.serviceData.Timesheets.filter((t) => {
        if (t.empid == tm.empid && t.projectid == project.id && t.sheetdate == a.getDate() && t.sheetmonth == (a.getMonth() + 1) && t.sheetyear == a.getFullYear()) {
          return true;
        }
        return false;
      });
      if (timesheetData.length > 0) {
        if (timesheetData[0].id) {
          atleastonesheet = true;
          var timesheetId = timesheetData[0].id;

          if (this.approvalChecked.indexOf(timesheetId.toString()) < 0 && $(event.target).is(':checked')) {
            this.approvalChecked.push(timesheetId.toString());
          }

          if (!$(event.target).is(':checked')) {
            if (this.approvalChecked.indexOf(timesheetId.toString()) >= 0) {
              this.approvalChecked.splice(this.approvalChecked.indexOf(timesheetId.toString()), 1);
            }
          }

        }
      }
    });

    if (!atleastonesheet) {
      var mnthToCheck = this.approvalDays[0].getMonth().toString();
      var yearToCheck = this.approvalDays[0].getFullYear().toString();
      this.serviceData.Submissions.forEach(s => {
        if (s.pid == project.id && s.empid == tm.empid && s.submonth == mnthToCheck && s.subyear == yearToCheck) {
          if (this.approvalsubmissions.indexOf(s.id.toString()) < 0 && $(event.target).is(':checked')) {
            this.approvalsubmissions.push(s.id.toString());
          }
          if (!$(event.target).is(':checked')) {
            if (this.approvalsubmissions.indexOf(s.id.toString()) >= 0) {
              this.approvalsubmissions.splice(this.approvalsubmissions.indexOf(s.id.toString()), 1);
            }
          }
        }
      });
    }
  }

  isTimeSheetSelected(project, dy, tm) {
    var timesheetId = this.getTimeSheetId(project, dy, tm);
    if (timesheetId) {
      if (this.approvalChecked.indexOf(timesheetId.toString()) >= 0) {
        return true;
      }
    }
    return false;
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

  addTimesheetComment() {
    var timesheetComment = {
      timesheetids: this.approvalChecked.join(','),
      comment: this.declinecomment
    };
    this.db.makeRequest('/timesheetcomments?lToken=' + this.db.CookieManager.get('lToken'), new this.db.Headers(), timesheetComment, 'POST').then((resp) => {

    });
  }
  closedeclinemodal() {
    $('#declineCommentModal').modal('hide');
  }

  opendeclineModal() {
    if (this.approvalChecked.length > 0) {
      $('#declineCommentModal').modal('show');
    } else if (this.approvalsubmissions.length > 0) {
      $('#declineCommentModal').modal('show');
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
        this.approvalsubmissions = [];
        this.getData('/timesheets', 'Timesheets', 'isTimesheetsLoaded');
        this.processData();
      });
    } else {
      if (this.approvalChecked.length > 0) {
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
          this.approvalsubmissions = [];
          this.getData('/timesheets', 'Timesheets', 'isTimesheetsLoaded');
          this.processData();
        });
      }

      if (this.approvalsubmissions.length > 0) {
        var promises = [];

        this.approvalsubmissions.forEach(s => {
          let p = this.db.makeRequest('/submissions?lToken=' + this.db.CookieManager.get('lToken'), new this.db.Headers(), { id: s }, 'DELETE');
          promises.push(p);
        });
        this.closedeclinemodal();
        Promise.all(promises).then((ddd) => {
          this.approvalsubmissions = [];
          this.approvalChecked = [];
        });

      }

    }
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
<<<<<<< HEAD
=======

    this.approvalProjects.forEach(p => {
      this.allchecked['P' + p.id] = {};
    });
>>>>>>> 265bccdb00a782de5c3d5ad900c32bb6bf2b3a5f
    this.approvalDays = this.generateMonthDays(new Date(this.toDay))
    this.waitingForapprovalsLoaded = true;
    console.log('test ');
  }
  processData() {
    this.myProjects = [];
    if (this.isLoaded.isSubmissionsLoaded && this.isLoaded.userLoaded && this.isLoaded.isEmpLoaded && this.isLoaded.isAllocationsLoaded && this.isLoaded.isProjectsLoaded && this.isLoaded.isTimesheetsLoaded) {
      if (this.serviceData.Projects.length > 0) {
        this.serviceData.Projects.forEach((project) => {
          var alls = this.serviceData.Allocations.filter((a) => {
            if (a.empid == this.profile.empid && a.projectid == project.id && project.id != 1) {
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
      }
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
<<<<<<< HEAD
  ngOnInit() {
    this.auth.checkUser().then(({ err, result }) => {
      console.log('result ', result);
=======

  startProcess() {
    this.auth.checkUser().then(({ err, result }) => {
>>>>>>> 265bccdb00a782de5c3d5ad900c32bb6bf2b3a5f
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
          this.monthDays = this.generateMonthDays(new Date(this.toDay));
        }
      } else {
        console.log('user not logged In');
      }
    });
  }

<<<<<<< HEAD
}
=======

  ngOnInit() {
    this.route.params.subscribe((params: ApprovalParams) => {
      if (params.pid) {
        this.projectID = params.pid;
      }
      this.startProcess();
    });
  }


  navigateToProject(project) {
    this.router.navigateByUrl('/my-approvals/' + project.id)
  }

}


class ApprovalParams {
  pid;
}
>>>>>>> 265bccdb00a782de5c3d5ad900c32bb6bf2b3a5f
