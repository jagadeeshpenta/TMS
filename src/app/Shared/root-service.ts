import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Cookie } from 'ng2-cookies';

import { DBService } from './dbservice';
import { AuthService } from './auth/auth.service';


@Injectable()
export class RootService {

    isLoaded = {
        isEmpLoaded: false,
        isProjectsLoaded: false,
        isAllocationsLoaded: false,
        isTimesheetsLoaded: false,
        isSubmissionsLoaded: false,
        isProjectsubmissionsLoaded: false,
        userLoaded: false
    };
    serviceData: any = {
        Employees: [],
        Projects: [],
        Allocations: [],
        Timesheets: [],
        Submissions: [],
        ProjectSubmissions: []
    };
    constructor(private db: DBService, private auth: AuthService) {

    }

    getData(entityName, dataName, loadedName) {
        return this.db.getLists({ entityName: entityName }).then(({ err, result }) => {
            if (!err) {
                this.isLoaded[loadedName] = true;
                this.serviceData[dataName] = result['rows'] ? result['rows'] : result;
            }
            return { err, result };
        });
    }
    getAllData() {
        var promises = [];
        promises.push(this.getData('/employees', 'Employees', 'isEmpLoaded'));
        promises.push(this.getData('/projects', 'Projects', 'isProjectsLoaded'));
        promises.push(this.getData('/allocations', 'Allocations', 'isAllocationsLoaded'));
        promises.push(this.getData('/timesheets', 'Timesheets', 'isTimesheetsLoaded'));
        promises.push(this.getData('/submissions', 'Submissions', 'isSubmissionsLoaded'));

        return Promise.all(promises);
    }

    getProjectSubmissions() {
        return this.getData('/projectsubmissions', 'ProjectSubmissions', 'isProjectsubmissionsLoaded');
    }

    getEmployeesByProject() {

    }

    getProjectsByEmployee() {

    }

    getTimesheets({ month, year, date, projectid, empid }) {

    }

    getSubmissions({ }) {

    }
}


class ServiceData {
    Employees = [];
    Projects = [];
    Allocations = [];
    Timesheets = [];
    Submissions = [];
}