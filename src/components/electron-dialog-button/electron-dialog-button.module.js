import angular from 'angular';
import { ElectronDialogButtonComponent } from './electron-dialog-button.component';
// import './electron-dialog-button.less';

export default angular
    .module('theProtonApp.electron-dialog-button', [])
    .component('electronDialogButton', ElectronDialogButtonComponent)
    .name;