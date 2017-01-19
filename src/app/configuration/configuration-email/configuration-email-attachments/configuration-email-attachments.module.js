import angular from 'angular';
import uiRouter from 'angular-ui-router';
import { ConfigurationEmailAttachmentsComponent } from './configuration-email-attachments.component';
// import './configuration-email-attachments.less';

export default angular
    .module('theProtonApp.configurationEmailAttachments', [
        uiRouter
    ])
    .component('configurationEmailAttachments', ConfigurationEmailAttachmentsComponent)
    .config(($stateProvider, $urlRouterProvider) => {
        'ngInject';
        $stateProvider
            .state('main.configuration.email.attachments', {
                url: '/attachments',
                component: 'configurationEmailAttachments'
            });
        $urlRouterProvider.otherwise('/');
    })
    .name;