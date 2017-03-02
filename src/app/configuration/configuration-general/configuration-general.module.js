import angular from 'angular';
import uiRouter from 'angular-ui-router';
import { ConfigurationGeneralComponent } from './configuration-general.component';
// import './configuration-general.less';

export default angular
    .module('theProtonApp.configurationGeneral', [
        uiRouter
    ])
    .component('configurationGeneral', ConfigurationGeneralComponent)
    .config(($stateProvider, $urlRouterProvider) => {
        'ngInject';
        $stateProvider
            .state('main.configuration.general', {
                url: '/general',
                component: 'configurationGeneral',
                resolve: {
                    template: ConfigurationTemplatesService => {
                        'ngInject'
                        return ConfigurationTemplatesService.getCurrentTemplate();
                    }
                }
            });
        $urlRouterProvider.otherwise('/');
    })
    .name;