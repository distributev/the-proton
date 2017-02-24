import angular from 'angular';
import uiRouter from 'angular-ui-router';
import { ConfigurationTemplatesComponent } from './configuration-templates.component';
import editTemplateModal from './edit-template-modal/edit-template-modal.module';
import { ConfigurationTemplates as ConfigurationTemplatesService } from './configuration-templates.service';
// import './configuration-templates.less';

export default angular
    .module('theProtonApp.configurationTemplates', [
        uiRouter,
        editTemplateModal
    ])
    .component('configurationTemplates', ConfigurationTemplatesComponent)
    .service('ConfigurationTemplatesService', ConfigurationTemplatesService)
    .config(($stateProvider, $urlRouterProvider) => {
        'ngInject';
        $stateProvider
            .state('main.configurationTemplates', {
                url: 'configuration-templates',
                component: 'configurationTemplates',
                resolve: {
                    templates: (ConfigurationTemplatesService) => {
                        'ngInject'
                        return ConfigurationTemplatesService.getTemplates();
                    }
                },
            });
        $urlRouterProvider.otherwise('/');
    })
    .name;