class VariablesButtonController {
    constructor($uibModal) {
        'ngInject';
        this.$uibModal = $uibModal;
    }

    $onInit() {}

    $onChanges(changes) {}

    onClick($event) {
        let modalInstance = this.$uibModal.open({
            animation: true,
            component: 'variablesModal',
            size: 'sm',
            resolve: {}
        });

        modalInstance.result.then(result => {
            this.onVariableSelected({
                $event: {
                    variable: result,
                    target: $event.target
                }
            });
        }, reason => {
            // console.log('modal-component dismissed with reason: ' + reason);
        });
    }
}

export const VariablesButtonComponent = {
    bindings: {
        onVariableSelected: '&'
    },
    template: require('./variables-button.html'),
    controller: VariablesButtonController
};