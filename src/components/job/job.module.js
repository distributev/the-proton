import angular from 'angular';
import { Job as JobService } from './job.service';

export default angular
    .module('theProtonApp.job', [])
    .service('JobService', JobService)
    .name;