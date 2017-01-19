import angular from 'angular';
import { BreadcrumbComponent } from './breadcrumb.component';
// import './breadcrumb.less';

export default angular
    .module('theProtonApp.breadcrumb', [])
    .component('breadcrumb', BreadcrumbComponent)
    .name;