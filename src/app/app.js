'use strict';

import angular from 'angular';
// import ngAnimate from 'angular-animate';
import ngCookies from 'angular-cookies';
import ngResource from 'angular-resource';
import ngSanitize from 'angular-sanitize';

import uiRouter from 'angular-ui-router';
import uiBootstrap from 'angular-ui-bootstrap';
// import ngMessages from 'angular-messages';

// Import all bootstrap plugins
import 'bootstrap/dist/js/npm';

import {
    routeConfig
} from './app.config';

import navbar from '../components/navbar/navbar.component';
import footer from '../components/footer/footer.component';
import main from './main/main.component';
import constants from './app.constants';
import mainSidebar from '../components/main-sidebar/main-sidebar.component';
import controlSidebar from '../components/control-sidebar/control-sidebar.component';

import './app.less';

angular.module('theProtonApp', [ngCookies, ngResource, ngSanitize, uiRouter, uiBootstrap, navbar,
        footer, main, constants, mainSidebar, controlSidebar
    ])
    .config(routeConfig);

angular.element(document)
    .ready(() => {
        angular.bootstrap(document, ['theProtonApp'], {
            strictDi: true
        });
    });