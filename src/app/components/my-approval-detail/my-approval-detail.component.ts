import { Component, OnInit } from '@angular/core';
import { RootService } from './../../Shared/root-service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from './../../Shared/auth/auth.service';
import { DBService } from './../../Shared/dbservice';

declare var $: any;
@Component({
  selector: 'app-my-approval-detail',
  templateUrl: './my-approval-detail.component.html',
  styleUrls: ['./my-approval-detail.component.scss']
})
export class MyApprovalDetailComponent implements OnInit {

  projectId;
  project = {
    name: ''
  };
  approvalDays = [];
  toDay;
  loading = true;
  routeParamsLoaded = false;
  userLoaded = false;
  profile;
  MonthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  weekNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  weekNamesLetters = ['Su', 'M', 'T', 'W', 'T', 'F', 'Sa'];
  approvalChecked = [];
  approvalsubmissions = [];
  allchecked = {};
  declinecomment = '';

  editDisabled = false;


  constructor(private db: DBService, private auth: AuthService, private root: RootService, private router: Router, private route: ActivatedRoute) { }

  sendMails(idsStr, typ) {
    var ids = idsStr.split(',');
    var updatedTimesheets = [];
    var emailids = [];
    this.root.serviceData.Timesheets.forEach((t) => {
      if (ids.filter((d) => { return d == t.id }).length > 0) {
        updatedTimesheets.push(t);
        var emps = this.root.serviceData.Employees.filter((em) => { return em.empid == t.empid });
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

  isSheetSubmitted(project, tm, approvalDays) {
    var timesheets = [];

    var projectTimesheets = this.root.serviceData.Timesheets.filter(t => { return t.projectid == project.id && t.empid == tm.empid; });
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
      this.root.serviceData.Submissions.forEach(s => {
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
        this.refreshData();
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
          this.refreshData();
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
    if (this.root.serviceData.Timesheets && this.root.serviceData.Timesheets.length > 0) {
      var timesheetData = this.root.serviceData.Timesheets.filter((t) => {
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
    if (this.root.serviceData.Timesheets && this.root.serviceData.Timesheets.length > 0) {
      var timesheetData = this.root.serviceData.Timesheets.filter((t) => {
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
    if (this.root.serviceData.Submissions && this.root.serviceData.Submissions.length > 0) {
      var isSubmitted = false;
      for (let i = 0, len = this.root.serviceData.Submissions.length; i < len; i++) {
        let sub = this.root.serviceData.Submissions[i];
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
  getTimeSheetId(project, loggedDate, emp) {
    var empid = emp ? emp.empid : this.profile.empid;
    if (this.root.serviceData.Timesheets && this.root.serviceData.Timesheets.length > 0) {
      var timesheetData = this.root.serviceData.Timesheets.filter((t) => {
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
    var dayToCount = this.approvalDays;
    if (this.root.serviceData.Timesheets && this.root.serviceData.Timesheets.length > 0) {
      var totalHours = 0;
      var timesheetbyempproject = this.root.serviceData.Timesheets.filter((t) => {
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
    if (this.root.serviceData.Timesheets && this.root.serviceData.Timesheets.length > 0) {
      var timesheetData = this.root.serviceData.Timesheets.filter((t) => {
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
  updateCheckedData(event) {
    var timesheetId = $(event.target).attr('timesheetid');
    if (timesheetId) {
      if (this.approvalChecked.indexOf(timesheetId.toString()) < 0) {
        this.approvalChecked.push(timesheetId.toString());
      } else {
        this.approvalChecked.splice(this.approvalChecked.indexOf(timesheetId.toString()), 1);
      }
    }
  }

  isAllSelected(project, tm, approvalChecked, approvalsubmissions) {
    var tcount = 0, tSelected = 0;
    var isateastonetimesheet = false;
    this.approvalDays.forEach(a => {
      var timesheetData = this.root.serviceData.Timesheets.filter((t) => {
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
      this.root.serviceData.Submissions.forEach(s => {
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

    if (this.allchecked['P' + project.id]) {
      this.allchecked['P' + project.id]['E' + tm.empid] = true;
    }

    var timesheets = [];
    var atleastonesheet = false;
    this.approvalDays.forEach(a => {
      var timesheetData = this.root.serviceData.Timesheets.filter((t) => {
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
      this.root.serviceData.Submissions.forEach(s => {
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
  checkLogHours(project, loggedDate, emp) {
    var empid = emp ? emp.empid : this.profile.empid;
    if (this.root.serviceData.Timesheets && this.root.serviceData.Timesheets.length > 0) {
      var timesheetData = this.root.serviceData.Timesheets.filter((t) => {
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

  moveApprovalDays(isNext) {
    this.approvalChecked = [];
    var ld;
    if (isNext) {
      var daytoGenerate = this.approvalDays[this.approvalDays.length - 1];
      if (daytoGenerate) {
        ld = new Date(daytoGenerate.getTime());
        ld.setDate(ld.getDate() + 1);
      }
    } else {
      var daytoGenerate = this.approvalDays[0];
      if (daytoGenerate) {
        ld = new Date(daytoGenerate.getTime());
        ld.setDate(ld.getDate() - 1);
      }
    }
    this.approvalDays = this.generateMonthDays(ld);
    this.isMonthSubmitted();
  }


  getProjectMembers(project) {
    let members = [];
    members = this.root.serviceData.Employees.filter((emp) => {
      var ismember = this.root.serviceData.Allocations.filter((a) => {
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

  projectSubmissions = [];
  projectSubmissionsLoaded = false;
  isMonthSubmitted() {
    this.editDisabled = false;
    if (!this.projectSubmissionsLoaded) {
      this.root.getProjectSubmissions().then((pSubmissions) => {
        if (!pSubmissions['err'] && pSubmissions['result']) {
          var results = pSubmissions['result'];
          this.projectSubmissions = results;
          this.projectSubmissionsLoaded = true;
          if (results.length > 0) {
            var submissionfound = false;
            results.forEach(ps => {
              if (ps.pid == this.project['id'] && ps.submonth == this.approvalDays[0].getMonth() && ps.subyear == this.approvalDays[0].getFullYear()) {
                submissionfound = true;
              }
            });

            if (submissionfound) {
              this.editDisabled = true;
            }
          }
        }
      });
    } else {
      var results = this.projectSubmissions;
      if (results.length > 0) {
        var submissionfound = false;
        results.forEach(ps => {
          if (ps.pid == this.project['id'] && ps.submonth == this.approvalDays[0].getMonth() && ps.subyear == this.approvalDays[0].getFullYear()) {
            submissionfound = true;
          }
        });

        if (submissionfound) {
          this.editDisabled = true;
        }
      }
    }

  }
 
  refreshData() {
    this.root.getAllData().then(() => {
      var filterProjects = this.root.serviceData.Projects.filter(p => { return p.id == this.projectId });
      if (filterProjects.length > 0) {
        this.project = filterProjects[0];
        this.approvalDays = this.generateMonthDays(new Date(this.toDay));
        this.loading = false;
        this.isMonthSubmitted();
      }
    });
  }


  startProcess() {
    if (this.routeParamsLoaded && this.userLoaded && this.profile) {
      this.refreshData();
    }
  }
  ngOnInit() {
    this.route.params.subscribe((params: ApprovalParams) => {
      if (params.pid) {
        this.projectId = params.pid;
        this.routeParamsLoaded = true;
        this.startProcess();
      }
    });

    this.auth.checkUser().then(({ err, result }) => {
      if (!err && result && result.profile) {
        this.profile = result.profile;
        this.toDay = result.toDay;
      }
      this.userLoaded = true;
      this.startProcess();
    });
  }


  submitProject() {
    var postData = {
      projectid: this.project['id'],
      submonth: this.approvalDays[0].getMonth(),
      subyear: this.approvalDays[0].getFullYear()
    };
    this.db.makeRequest('/projectsubmissions?lToken=' + this.db.CookieManager.get('lToken'), new this.db.Headers(), postData, 'POST').then((resp) => {
      this.editDisabled = true;
    });
  }

}

class ApprovalParams {
  pid;
}

class Project {
  id: number;
  name: string;

}