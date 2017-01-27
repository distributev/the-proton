import angular from 'angular';
import uiRouter from 'angular-ui-router';
import { EditTemplateModalComponent } from './edit-template-modal.component';
// import './edit-template-modal.less';

export default angular
    .module('theProtonApp.editTemplateModal', [
        uiRouter
    ])
    .component('editTemplateModal', EditTemplateModalComponent)
    .name;