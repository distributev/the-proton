import angular from 'angular';
import { ConfirmationModalComponent } from './confirmation-modal.component';
// import './confirmation-modal.less';

export default angular
    .module('theProtonApp.confirmationModal', [])
    .component('confirmationModal', ConfirmationModalComponent)
    .name;