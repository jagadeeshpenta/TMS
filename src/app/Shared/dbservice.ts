import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Cookie } from 'ng2-cookies';

import { environment } from './../../environments/environment';
import { ToastrService, ToastConfig } from './../../../node_modules/toastr-ng2';

@Injectable()
export class DBService {
  baseUrl = environment.apiUrl;
  lToken;
  cacheData: any;
  CookieManager;
  Headers;
 
  toastrInstance;
  toastCfg = new ToastConfig({ timeOut: 900 });
  constructor(private http: Http, private toastr: ToastrService) {
    this.lToken = Cookie.get('lToken');
    this.CookieManager = Cookie;
    this.Headers = Headers;
    this.toastrInstance = toastr;
  }

  makeRequest(url, headers, reqData, method) {
    var self = this;
    return new Promise((res) => {
      switch (method) {
        case 'POST':
          var urlToPost = this.baseUrl + url;
          self.http.post(urlToPost, reqData, { headers }).subscribe((resp) => {
            res(resp.json());
          }, (err) => {
            res({ err });
          });
          break;
        case 'GET':
          var params = new URLSearchParams();
          if (reqData) {
            Object.keys(reqData).forEach((ky) => {
              params[ky] = reqData[ky];
            });
          }
          self.http.get(this.baseUrl + url + '?lToken=' + Cookie.get('lToken') + '&ttt=' + (new Date().getTime()), { headers, search: params }).subscribe((resp) => {
            res(resp.json());
          }, (err) => {
            res({ err });
          });
          break;
        case 'DELETE':
          self.http.delete(this.baseUrl + url + '&id=' + reqData.id).subscribe((resp) => {
            res(resp.json());
          });
          break;
        default:
          break;
      }
    });
  }

  changePassword({ currentPassword, newPassword }) {
    return new Promise((res) => {
      this.makeRequest('/changepassword?lToken=' + Cookie.get('lToken'), {}, { currentpassword: currentPassword, newpassword: newPassword }, 'POST').then((resp) => {
        res(resp);
      })
    });
  }

  addEmployee({ newEmployee }) {
    return new Promise((res, rej) => {
      this.makeRequest('/employees?lToken=' + Cookie.get('lToken'), new Headers(), newEmployee, 'POST').then((resp) => {
        res(resp);
      });
    });
  }

  deleteEmployee({ empToDelete }) {
    return new Promise((res, rej) => {
      this.makeRequest('/employees?lToken=' + Cookie.get('lToken'), new Headers(), empToDelete, 'DELETE').then((resp) => {
        res(resp);
      });
    });
  }

  updateEmployee({ profile }) {
    return new Promise((res, rej) => {
      this.makeRequest('/profile?lToken=' + Cookie.get('lToken'), new Headers(), profile, 'POST').then((resp) => {
        res(resp);
      });
    });
  }
  approveTimesheets({ sheets }) {
    return new Promise((res, rej) => {
      this.makeRequest('/approvetimesheets?lToken=' + Cookie.get('lToken'), new Headers(), sheets, 'POST').then((resp) => {
        res(resp);
      });
    });
  }

  authenticate(userCreds) {
    var self = this;
    return new Promise((res, rej) => {
      self.makeRequest('/authenticate', new Headers(), userCreds, 'POST').then((resp) => {
        res(resp);
      });
    });
  }


  getProjects({ lToken }) {
    var self = this;
    return new Promise((res, rej) => {
      self.makeRequest('/projects?lToken=' + Cookie.get('lToken'), new Headers(), { lToken }, 'GET').then((resp) => {
        res(resp);
      });
    });
  }

  getLists({ entityName, flush = false }) {
    var self = this;
    return new Promise((res, rej) => {
      self.makeRequest(entityName, new Headers(), { lToken: Cookie.get('lToken') }, 'GET').then((resp) => {
        res(resp);
      });
    });
  }

  addProject(newProject) {
    return new Promise((res) => {
      this.makeRequest('/projects?lToken=' + Cookie.get('lToken'), new Headers(), {
        name: newProject.name,
        actualstartdate: newProject.actualstartdate,
        actualenddate: newProject.actualenddate
      }, 'POST').then((resp) => {
        res(resp);
      });
    });
  }

  editProject(project) {
    return new Promise((res) => {
      this.makeRequest('/projects?lToken=' + Cookie.get('lToken'), new Headers(), {
        id: project.id,
        name: project.editName,
        actualstartdate: project.editStartDate,
        actualenddate: project.editEndDate
      }, 'POST').then((resp) => {
        res(resp);
      });
    });
  }
 
  deleteProject({ projectToDelete }) {
    return new Promise((res, rej) => {
      this.makeRequest('/projects?lToken=' + Cookie.get('lToken'), new Headers(), projectToDelete, 'DELETE').then((resp) => {
        res(resp);
      });
    });
  }

  addToProject({ id = 0, empid, projectid, role }) {
    return new Promise((res) => {
      this.makeRequest('/allocations?lToken=' + Cookie.get('lToken'), new Headers(), {
        id,
        empid,
        projectid,
        role
      }, 'POST').then((resp) => {
        res(resp);
      });
    });
  }

  removeFromProject({ id }) {
    return new Promise((res) => {
      this.makeRequest('/allocations?lToken=' + Cookie.get('lToken'), new Headers(), {
        id
      }, 'DELETE').then((resp) => {
        res(resp);
      });
    });
  }

  addTimesheet(newlogTimesheet) {
    return new Promise((res) => {
      this.makeRequest('/timesheets?lToken=' + Cookie.get('lToken'), new Headers(), newlogTimesheet, 'POST').then((resp) => {
        res(resp);
      });
    });
  }


  sendMail(mailOptions) {
    return new Promise((res) => {
      this.makeRequest('/sendmail?lToken=' + Cookie.get('lToken'), new Headers(), mailOptions, 'POST').then((resp) => {
        res(resp);
      });
    });
  }

}
