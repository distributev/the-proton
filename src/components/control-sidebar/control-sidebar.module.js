import angular from 'angular';
import { ControlSidebarComponent } from './control-sidebar.component';
// import './control-sidebar.less';

export default angular
    .module('theProtonApp.controlSidebar', [])
    .component('controlSidebar', ControlSidebarComponent)
    .name;