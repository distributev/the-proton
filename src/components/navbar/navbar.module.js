import angular from 'angular';
import { NavbarComponent } from './navbar.component';
// import './navbar.less';

export default angular
    .module('theProtonApp.navbar', [])
    .component('navbar', NavbarComponent)
    .name;