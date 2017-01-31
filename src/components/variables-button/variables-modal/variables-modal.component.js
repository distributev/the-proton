class VariablesModalController {
    constructor(VariablesService) {
        'ngInject';
        this.VariablesService = VariablesService;
    }

    $onInit() {
        this.VariablesService.getVariables().then(variables => this.variables = variables);
    }

    $onChanges(changes) {}

    getSelectedVariable() {
        return _.find(this.variables, 'active');
    }

    onVariableClick(variable) {
        angular.forEach(this.variables, each => {
            each.active = (each.name === variable.name) ? true : false;
        });
    }

    ok() {
        this.close({ $value: this.getSelectedVariable() });
    }

    cancel() {
        this.dismiss({ $value: 'cancel' });
    }
}

export const VariablesModalComponent = {
    bindings: {
        resolve: '<',
        close: '&',
        dismiss: '&'
    },
    template: require('./variables-modal.html'),
    controller: VariablesModalController
};