'use strict';
/* eslint no-sync: 0 */

import angular from 'angular';

export class NavbarController {
    menu = [{
        title: 'Home',
        state: 'main'
    }];
    isCollapsed = true;

}

export default angular.module('directives.navbar', [])
    .component('navbar', {
        template: require('./navbar.html'),
        controller: NavbarController
    })
    .name;