import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Cookie } from 'ng2-cookies';

import { environment } from './../../environments/environment';
import { ToastrService, ToastConfig } from './../../../node_modules/toastr-ng2';

declare var WebSocket: any;

@Injectable()
export class DBService {
  baseUrl = environment.apiUrl;
  lToken;
  cacheData: any;
  CookieManager;
  Headers;

  toastrInstance;
  toastCfg = new ToastConfig({ timeOut: 900 });

  ws;
  wsactions = [];
  wsEnabled = false;
  guid(len) {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    if (len == 8) {
      return s4() + s4();
    }
    switch (len) {
      case 4:
        return s4();
      case 8:
        return s4() + s4();
      case 12:
        return s4() + s4() + s4();
    }

    return s4() + s4() + s4() + s4() + s4() + s4() + (new Date).getTime().toString(16);
  };

  onwsmessage(e) {
    var data;
    try {
      data = JSON.parse(e.data);
      if (data) {
        var wsAction = this.wsactions.filter(w => {
          return w.guid === data.reqGuid;
        });
        if (wsAction && wsAction.length > 0) {
          wsAction = wsAction[0];
          data.result = data.result.rows ? data.result.rows : data.result;
          wsAction['resolve'](data);
        }
      }
    } catch (g) {

    }
  }
  onwserror(e) {

  }
  onwsclose(e) {

  }
  constructor(private http: Http, private toastr: ToastrService) {
    this.lToken = Cookie.get('lToken');
    this.CookieManager = Cookie;
    this.Headers = Headers;
    this.toastrInstance = toastr;
 


    if (this.wsEnabled) {
      this.ws = new WebSocket(environment.wsUrl, 'echo-protocol');
      this.ws.onopen = function () {
        
      };

      this.ws.onmessage = this.onwsmessage.bind(this);
      this.ws.onwsclose = this.onwsclose;
    }
  }



  makeRequest(url, headers, reqData, method) {
    var self = this;
    return new Promise((res) => {
      switch (method) {
        case 'POST':
          var urlToPost = this.baseUrl + url;
          if (this.wsEnabled && this.ws.readyState === this.ws.OPEN) {
            var actionguid = this.guid(12);
            this.wsactions.push({ guid: actionguid, resolve: res });
            this.ws.send(JSON.stringify({ method: 'POST', url: url, data: reqData, guid: actionguid, lToken: Cookie.get('lToken') }));
          } else {
            self.http.post(urlToPost, reqData, { headers }).subscribe((resp) => {
              res(resp.json());
            }, (err) => {
              res({ err });
            });
          }
          break;
        case 'GET':
          var params = new URLSearchParams();
          if (reqData) {
            Object.keys(reqData).forEach((ky) => {
              params[ky] = reqData[ky];
            });
          }
          var urlToGet = this.baseUrl + url + '?lToken=' + Cookie.get('lToken') + '&ttt=' + (new Date().getTime());
          if (this.wsEnabled && this.ws.readyState === this.ws.OPEN) {
            var actionguid = this.guid(12);
            this.wsactions.push({ guid: actionguid, resolve: res });
            this.ws.send(JSON.stringify({ method: 'GET', url: url, data: reqData, guid: actionguid, lToken: Cookie.get('lToken') }));
          } else {
            self.http.get(urlToGet, { headers, search: params }).subscribe((resp) => {
              res(resp.json());
            }, (err) => {
              res({ err });
            });
          }

          break;
        case 'DELETE':
          var urlToDelete = this.baseUrl + url + '&id=' + reqData.id;
          self.http.delete(urlToDelete).subscribe((resp) => {
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

  addToProject({ id = 0, empid, projectid, role, isbillable = true }) {
    return new Promise((res) => {
      this.makeRequest('/allocations?lToken=' + Cookie.get('lToken'), new Headers(), {
        id,
        empid,
        projectid,
        role,
        isbillable
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
