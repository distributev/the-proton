import angular from 'angular';
import uiRouter from 'angular-ui-router';
import { ConfigurationUploadSftpComponent } from './configuration-upload-sftp.component';
// import './configuration-upload-sftp.less';

export default angular
    .module('theProtonApp.configurationUploadSftp', [
        uiRouter
    ])
    .component('configurationUploadSftp', ConfigurationUploadSftpComponent)
    .config(($stateProvider, $urlRouterProvider) => {
        'ngInject';
        $stateProvider
            .state('main.configuration.upload.sftp', {
                url: '/sftp',
                component: 'configurationUploadSftp'
            });
        $urlRouterProvider.otherwise('/');
    })
    .name;