import angular from 'angular';
import { MainSidebarComponent } from './main-sidebar.component';
// import './main-sidebar.less';

export default angular
    .module('theProtonApp.mainSidebar', [])
    .component('mainSidebar', MainSidebarComponent)
    .name;