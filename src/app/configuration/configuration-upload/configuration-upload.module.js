import angular from 'angular';
import uiRouter from 'angular-ui-router';
import { ConfigurationUploadComponent } from './configuration-upload.component';
import configurationUploadFtp from './configuration-upload-ftp/configuration-upload-ftp.module';
import configurationUploadSftp from './configuration-upload-sftp/configuration-upload-sftp.module';
// import './configuration-upload.less';

export default angular
    .module('theProtonApp.configurationUpload', [
        uiRouter,
        configurationUploadFtp,
        configurationUploadSftp
    ])
    .component('configurationUpload', ConfigurationUploadComponent)
    .config(($stateProvider, $urlRouterProvider) => {
        'ngInject';
        $stateProvider
            .state('main.configuration.upload', {
                url: '/upload',
                redirectTo: 'main.configuration.upload.ftp',
                component: 'configurationUpload'
            });
        $urlRouterProvider.otherwise('/');
    })
    .name;