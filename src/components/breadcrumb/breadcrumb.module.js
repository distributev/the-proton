import angular from 'angular';
import { BreadcrumbComponent } from './breadcrumb.component';
import { Breadcrumb as BreadcrumbService } from './breadcrumb.service';
// import './breadcrumb.less';

export default angular
    .module('theProtonApp.breadcrumb', [])
    .component('breadcrumb', BreadcrumbComponent)
    .service('BreadcrumbService', BreadcrumbService)
    .name;