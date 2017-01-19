import angular from 'angular';
import uiRouter from 'angular-ui-router';
import { ConfigurationComponent } from './configuration.component';
import configurationGeneral from './configuration-general/configuration-general.module';
import configurationEmail from './configuration-email/configuration-email.module';
import configurationAdvanced from './configuration-advanced/configuration-advanced.module';
// import { ConfigurationService } from './configuration.service';
// import './configuration.less';

export default angular
    .module('theProtonApp.configuration', [
        uiRouter,
        configurationGeneral,
        configurationEmail,
        configurationAdvanced
    ])
    .component('configuration', ConfigurationComponent)
    //   .service('ConfigurationService', ConfigurationService)
    .config(($stateProvider, $urlRouterProvider) => {
        'ngInject';
        $stateProvider
            .state('main.configuration', {
                url: 'configuration',
                redirectTo: 'main.configuration.general',
                component: 'configuration',
                resolve: {
                    $transition$: '$transition$'
                }
            });
        $urlRouterProvider.otherwise('/');
    })
    .name;