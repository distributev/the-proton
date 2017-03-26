import angular from 'angular';
import { Logger as LoggerService } from './logger.service';

export default angular
    .module('theProtonApp.logger', [])
    .service('LoggerService', LoggerService)
    .name;