import angular from 'angular';
import uiRouter from 'angular-ui-router';
import { AttachmentModalComponent } from './attachment-modal.component';
// import './attachment-modal.less';

export default angular
    .module('theProtonApp.attachmentModal', [
        uiRouter
    ])
    .component('attachmentModal', AttachmentModalComponent)
    .name;