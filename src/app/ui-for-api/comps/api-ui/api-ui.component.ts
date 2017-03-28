import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ApiUiService } from './../../services/api-ui.service'
declare var $: any;
@Component({
	selector: 'app-api-ui',
	templateUrl: './api-ui.component.html',
	styleUrls: ['./api-ui.component.scss']
})
export class ApiUiComponent implements OnInit, AfterViewInit {
	userCreds = {
		username: '943',
		password: 'murali',
		lToken: ''
	};
	hideErrMsg = true;
	isAuthenticated = false;
	afterLoadingData = false;

	profile = {};

	Projects;
	Employees;
	Timesheets;
	Allocations;

	dataLoadPromises = {
		isProjectsLoaded: false,
		isEmployessLoaded: false,
		isTimesheetsLoaded: false,
		isAllocationsLoaded: false
	};

	newEmployee = {
		reportingmanager: 0
	};
	constructor(public api: ApiUiService) { }

	ngOnInit() {

	}

	ngAfterViewInit() {
		// console.log('elem ', $('#addEmployeeModal'));
	}

	addEmployee() {

		this.api.addEmployee({ newEmployee: this.newEmployee, lToken: this.userCreds.lToken }).then((resp) => {
			console.log('response on new employee : ', resp);
		});

		$('#addEmployeeModal').modal('hide');
	}

	getlToken(): void {
		this.hideErrMsg = true;
		this.api.authenticate(this.userCreds).then(({ err, result }) => {
			if (!err) {
				this.userCreds.lToken = result.lToken;
				this.profile = result.profile;
				this.isAuthenticated = true;
				this.getData();
			} else {
				this.hideErrMsg = false;
			}
		});
	}

	getData() {
		this.getList('projects');
		this.getList('timesheets');
		this.getList('employees');
		this.getList('allocations');
	}

	parseData() {
		if (this.dataLoadPromises.isAllocationsLoaded && this.dataLoadPromises.isProjectsLoaded && this.dataLoadPromises.isEmployessLoaded && this.dataLoadPromises.isTimesheetsLoaded) {
			if (this.Projects instanceof Array && this.Projects.length > 0) {
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
				this.afterLoadingData = true;
			}
		}
	}

	getList(entityName) {
		this.api.getLists({ entityName, lToken: this.userCreds.lToken }).then(({ err, result }) => {
			switch (entityName) {
				case 'employees':
					this.Employees = result;
					this.dataLoadPromises.isEmployessLoaded = true;
					break;
				case 'projects':
					this.Projects = result;
					this.dataLoadPromises.isProjectsLoaded = true;
					break;
				case 'timesheets':
					this.Timesheets = result;
					this.dataLoadPromises.isTimesheetsLoaded = true;
					break
				case 'allocations':
					this.Allocations = result;
					this.dataLoadPromises.isAllocationsLoaded = true;
					break;
				default:
					break;
			};
			this.parseData();
		});
	}
}
