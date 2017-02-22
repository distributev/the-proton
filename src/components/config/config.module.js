import angular from 'angular';
import { Config as ConfigService } from './config.service';
import environment from './env';

export default angular
    .module('theProtonApp.config', [environment.name])
    .service('ConfigService', ConfigService)
    .name;