'use strict';

import angular from 'angular';
// import ngAnimate from 'angular-animate';
import ngCookies from 'angular-cookies';
import ngResource from 'angular-resource';
import ngSanitize from 'angular-sanitize';

import uiRouter from 'angular-ui-router';
import uiBootstrap from 'angular-ui-bootstrap';
import 'angular-ui-ace';
// import ngMessages from 'angular-messages';

// Import all bootstrap plugins
import 'bootstrap/dist/js/npm';

import {
    routeConfig
} from './app.config';

import navbar from '../components/navbar/navbar.component';
import footer from '../components/footer/footer.component';
import main from './main/main.component';
import breadcrumb from '../components/breadcrumb/breadcrumb.module';
import home from './home/home.module';
import constants from './app.constants';
import mainSidebar from '../components/main-sidebar/main-sidebar.component';
import controlSidebar from '../components/control-sidebar/control-sidebar.component';
import skin from '../components/skin/skin.module';
import processing from './processing/processing.module';
import configuration from './configuration/configuration.module';
import configurationTemplates from './configuration-templates/configuration-templates.module';
import loggingTracing from './logging-tracing/logging-tracing.module';
import electronDialogButton from '../components/electron-dialog-button/electron-dialog-button.module';
import variablesButton from '../components/variables-button/variables-button.module';
import confirmationModal from '../components/confirmation-modal/confirmation-modal.module';

import './app.less';

angular.module('theProtonApp', [ngCookies, ngResource, ngSanitize, uiRouter, uiBootstrap, 'ui.ace', navbar,
        footer, main, breadcrumb, home, constants, mainSidebar, controlSidebar, skin,
        processing, configuration, configurationTemplates, loggingTracing, electronDialogButton, variablesButton, confirmationModal
    ])
    .config(routeConfig);

angular.element(document)
    .ready(() => {
        angular.bootstrap(document, ['theProtonApp'], {
            strictDi: true
        });
    });