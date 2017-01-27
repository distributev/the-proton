import angular from 'angular';
import uiRouter from 'angular-ui-router';
import { ConfigurationTemplatesComponent } from './configuration-templates.component';
import editTemplateModal from './edit-template-modal/edit-template-modal.module';
// import './configuration-templates.less';

export default angular
    .module('theProtonApp.configurationTemplates', [
        uiRouter,
        editTemplateModal
    ])
    .component('configurationTemplates', ConfigurationTemplatesComponent)
    .config(($stateProvider, $urlRouterProvider) => {
        'ngInject';
        $stateProvider
            .state('main.configurationTemplates', {
                url: 'configuration-templates',
                component: 'configurationTemplates'
            });
        $urlRouterProvider.otherwise('/');
    })
    .name;