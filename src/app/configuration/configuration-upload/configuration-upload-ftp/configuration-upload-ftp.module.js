import angular from 'angular';
import uiRouter from 'angular-ui-router';
import { ConfigurationUploadFtpComponent } from './configuration-upload-ftp.component';
// import './configuration-upload-ftp.less';

export default angular
    .module('theProtonApp.configurationUploadFtp', [
        uiRouter
    ])
    .component('configurationUploadFtp', ConfigurationUploadFtpComponent)
    .config(($stateProvider, $urlRouterProvider) => {
        'ngInject';
        $stateProvider
            .state('main.configuration.upload.ftp', {
                url: '/ftp',
                component: 'configurationUploadFtp',
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
