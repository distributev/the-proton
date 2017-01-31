import angular from 'angular';
import uiRouter from 'angular-ui-router';
import { ConfigurationEmailMessageLargerModalComponent } from './configuration-email-message-larger-modal.component';
// import './configuration-email-message-larger-modal.less';

export default angular
    .module('theProtonApp.configurationEmailMessageLargerModal', [
        uiRouter
    ])
    .component('configurationEmailMessageLargerModal', ConfigurationEmailMessageLargerModalComponent)
    .name;