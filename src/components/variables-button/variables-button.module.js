import angular from 'angular';
import { VariablesButtonComponent } from './variables-button.component';
import { Variables as VariablesService } from './variables.service';
import variablesModal from './variables-modal/variables-modal.module';
// import './variables-button.less';

export default angular
    .module('theProtonApp.variables-button', [
        variablesModal,
    ])
    .component('variablesButton', VariablesButtonComponent)
    .service('VariablesService', VariablesService)
    .name;