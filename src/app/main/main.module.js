import angular from 'angular';
import uiRouter from 'angular-ui-router';
import { MainComponent } from './main.component';

export default angular
    .module('theProtonApp.main', [uiRouter])
    .component('main', MainComponent)
    .config(($stateProvider, $urlRouterProvider) => {
        'ngInject';
        $stateProvider
            .state('main', {
                url: '/',
                redirectTo: 'main.processing.doAction',
                resolve: {
                    skin: function(SkinService) {
                        'ngInject';
                        return SkinService.getSkin();
                    }
                },
                component: 'main'
            });
        $urlRouterProvider.otherwise('/');
    })
    .name;