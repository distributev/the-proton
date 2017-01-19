import angular from 'angular';
import uiRouter from 'angular-ui-router';
import { ConfigurationEmailSettingsComponent } from './configuration-email-settings.component';
// import './configuration-email-settings.less';

export default angular
    .module('theProtonApp.configurationEmailSettings', [
        uiRouter
    ])
    .component('configurationEmailSettings', ConfigurationEmailSettingsComponent)
    .config(($stateProvider, $urlRouterProvider) => {
        'ngInject';
        $stateProvider
            .state('main.configuration.email.settings', {
                url: '/settings',
                component: 'configurationEmailSettings'
            });
        $urlRouterProvider.otherwise('/');
    })
    .name;