'use strict';

import angular from 'angular';
// import ngAnimate from 'angular-animate';
import ngCookies from 'angular-cookies';
import ngResource from 'angular-resource';
import ngSanitize from 'angular-sanitize';

import uiRouter from 'angular-ui-router';
import uiBootstrap from 'angular-ui-bootstrap';
import 'angular-ui-ace';
import luegg from 'angularjs-scroll-glue';
// import ngMessages from 'angular-messages';

// Import all bootstrap plugins
import 'bootstrap/dist/js/npm';

import {
    routeConfig
} from './app.config';

import navbar from '../components/navbar/navbar.module';
import footer from '../components/footer/footer.module';
import config from '../components/config/config.module';
import main from './main/main.module';
import breadcrumb from '../components/breadcrumb/breadcrumb.module';
import constants from './app.constants';
import mainSidebar from '../components/main-sidebar/main-sidebar.module';
import controlSidebar from '../components/control-sidebar/control-sidebar.module';
import skin from '../components/skin/skin.module';
import processing from './processing/processing.module';
import configuration from './configuration/configuration.module';
import configurationTemplates from './configuration-templates/configuration-templates.module';
import loggingTracing from './logging-tracing/logging-tracing.module';
import about from './about/about.module';
import electronDialogButton from '../components/electron-dialog-button/electron-dialog-button.module';
import variablesButton from '../components/variables-button/variables-button.module';
import confirmationModal from '../components/confirmation-modal/confirmation-modal.module';
import feedbackModal from '../components/feedback-modal/feedback-modal.module';
import job from '../components/job/job.module';
import logger from '../components/logger/logger.module';
import changesDetected from '../components/changes-detected/changes-detected.module';

import './app.less';

angular.module('theProtonApp', [ngCookies, ngResource, ngSanitize, uiRouter, uiBootstrap, 'ui.ace', luegg, navbar,
        footer, config, main, breadcrumb, constants, mainSidebar, controlSidebar, skin,
        processing, configuration, configurationTemplates, loggingTracing, about, electronDialogButton,
        variablesButton, confirmationModal, feedbackModal, job, logger, changesDetected
    ])
    .config(routeConfig)
    .run(($transitions, $uibModal, $q, BreadcrumbService, LoggerService, ConfigurationTemplatesService) => {
        'ngInject';
        ConfigurationTemplatesService.getDefault()
            .then(() => LoggerService.initLogger())
            .then(() => {
                $transitions.onExit({ exiting: 'main.configuration.**' }, ($transition$) => {
                    return ConfigurationTemplatesService.checkForChanges()
                        .then(changes => {
                            if (changes && !$transition$.to().name.startsWith('main.configuration')) {
                                return $uibModal.open({
                                    animation: true,
                                    component: 'confirmationModal',
                                    size: 'sm',
                                    resolve: {
                                        title: () => 'Unsaved Changes',
                                        message: () => 'You have unsaved changes!',
                                        okLabel: () => 'Save',
                                        cancelLabel: () => 'Cancel'
                                    }
                                }).result.then(result => {
                                    if (result) {
                                        return ConfigurationTemplatesService.setTemplate()
                                            .then(() => {
                                                return $uibModal.open({
                                                    animation: true,
                                                    component: 'feedbackModal',
                                                    size: 'sm',
                                                    resolve: {
                                                        message: () => `Configuration settings saved!`
                                                    }
                                                }).result.then(() => $q.resolve(true), () => $q.resolve(true));
                                            });
                                    } else {
                                        return $q.resolve(false);
                                    }
                                }, () => {
                                    return $q.resolve(false);
                                });
                            } else {
                                return $q.resolve(true)
                            }
                        });
                });
            });

        $transitions.onSuccess({}, ($transition$) => {
            BreadcrumbService.setCurrentState($transition$.treeChanges().to);
        });
    });

angular.element(document)
    .ready(() => {
        angular.bootstrap(document, ['theProtonApp'], {
            strictDi: true
        });
    });
