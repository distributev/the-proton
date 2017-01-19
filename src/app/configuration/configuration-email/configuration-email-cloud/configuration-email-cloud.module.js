import angular from 'angular';
import uiRouter from 'angular-ui-router';
import { ConfigurationEmailCloudComponent } from './configuration-email-cloud.component';
// import './configuration-email-cloud.less';

export default angular
    .module('theProtonApp.configurationEmailCloud', [
        uiRouter
    ])
    .component('configurationEmailCloud', ConfigurationEmailCloudComponent)
    .config(($stateProvider, $urlRouterProvider) => {
        'ngInject';
        $stateProvider
            .state('main.configuration.email.cloud', {
                url: '/cloud',
                component: 'configurationEmailCloud'
            });
        $urlRouterProvider.otherwise('/');
    })
    .name;