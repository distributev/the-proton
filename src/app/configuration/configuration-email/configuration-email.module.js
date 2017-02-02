import angular from 'angular';
import uiRouter from 'angular-ui-router';
import { ConfigurationEmailComponent } from './configuration-email.component';
import configurationEmailSettings from './configuration-email-settings/configuration-email-settings.module';
import configurationEmailMessage from './configuration-email-message/configuration-email-message.module';
import configurationEmailAttachments from './configuration-email-attachments/configuration-email-attachments.module';
import configurationEmailCloud from './configuration-email-cloud/configuration-email-cloud.module';
import { ConfigurationEmail as ConfigurationEmailService } from './configuration-email.service';
import wellKnownServicesModal from './well-known-services-modal/well-known-services-modal.module';
// import './configuration-email.less';

export default angular
    .module('theProtonApp.configurationEmail', [
        uiRouter,
        configurationEmailSettings,
        configurationEmailMessage,
        configurationEmailAttachments,
        configurationEmailCloud,
        wellKnownServicesModal
    ])
    .component('configurationEmail', ConfigurationEmailComponent)
    .service('ConfigurationEmailService', ConfigurationEmailService)
    .config(($stateProvider, $urlRouterProvider) => {
        'ngInject';
        $stateProvider
            .state('main.configuration.email', {
                url: '/email',
                // redirectTo: 'main.configuration.email.settings',
                component: 'configurationEmail'
            });
        $urlRouterProvider.otherwise('/');
    })
    .name;