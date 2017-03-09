import angular from 'angular';
import uiRouter from 'angular-ui-router';
import { ConfigurationEmailAttachmentsComponent } from './configuration-email-attachments.component';
import attachmentModal from './attachment-modal/attachment-modal.module';
// import './configuration-email-attachments.less';

export default angular
    .module('theProtonApp.configurationEmailAttachments', [
        uiRouter,
        attachmentModal
    ])
    .component('configurationEmailAttachments', ConfigurationEmailAttachmentsComponent)
    .config(($stateProvider, $urlRouterProvider) => {
        'ngInject';
        $stateProvider
            .state('main.configuration.email.attachments', {
                url: '/attachments',
                component: 'configurationEmailAttachments',
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