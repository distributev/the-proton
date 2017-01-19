import angular from 'angular';
import uiRouter from 'angular-ui-router';
import { ConfigurationEmailMessageComponent } from './configuration-email-message.component';
// import './configuration-email-message.less';

export default angular
    .module('theProtonApp.configurationEmailMessage', [
        uiRouter
    ])
    .component('configurationEmailMessage', ConfigurationEmailMessageComponent)
    .config(($stateProvider, $urlRouterProvider) => {
        'ngInject';
        $stateProvider
            .state('main.configuration.email.message', {
                url: '/message',
                component: 'configurationEmailMessage'
            });
        $urlRouterProvider.otherwise('/');
    })
    .name;