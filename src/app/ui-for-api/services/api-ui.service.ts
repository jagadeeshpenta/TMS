import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';



@Injectable()
export class ApiUiService {
	baseUrl = 'http://localhost:1212';
	constructor(public http: Http) {

	}

	private makeRequest(url, headers, reqData, method) {
		var self = this;
		return new Promise((res) => {
			switch (method) {
				case 'POST':
					self.http.post(this.baseUrl + url, reqData, { headers }).subscribe((resp) => {
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
					self.http.get(this.baseUrl + url + '?lToken=' + reqData.lToken, { headers, search: params }).subscribe((resp) => {
						res(resp.json());
					}, (err) => {
						res({ err });
					});
					break;
				default:
					break;
			}
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
			self.makeRequest('/projects', new Headers(), { lToken }, 'GET').then((resp) => {
				res(resp);
			});
		});
	}

	getLists({ lToken, entityName }) {
		var self = this;
		return new Promise((res, rej) => {
			self.makeRequest('/' + entityName, new Headers(), { lToken }, 'GET').then((resp) => {
				res(resp);
			});
		});
	}
}
