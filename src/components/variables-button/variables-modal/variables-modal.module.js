import angular from 'angular';
import { VariablesModalComponent } from './variables-modal.component';
// import './variables-modal.less';

export default angular
    .module('theProtonApp.variablesModal', [])
    .component('variablesModal', VariablesModalComponent)
    .name;