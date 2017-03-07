import angular from 'angular';
import uiRouter from 'angular-ui-router';
import { ConfigurationEmailMessageComponent } from './configuration-email-message.component';
import configurationEmailMessageLargerModal from './configuration-email-message-larger-modal/configuration-email-message-larger-modal.module';
// import './configuration-email-message.less';

export default angular
    .module('theProtonApp.configurationEmailMessage', [
        uiRouter,
        configurationEmailMessageLargerModal
    ])
    .component('configurationEmailMessage', ConfigurationEmailMessageComponent)
    .config(($stateProvider, $urlRouterProvider) => {
        'ngInject';
        $stateProvider
            .state('main.configuration.email.message', {
                url: '/message',
                component: 'configurationEmailMessage',
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