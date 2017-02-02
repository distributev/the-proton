class WellKnownServicesModalController {
    constructor(ConfigurationEmailService, $uibModal) {
        'ngInject';
        this.ConfigurationEmailService = ConfigurationEmailService;
        this.$uibModal = $uibModal;
    }

    $onInit() {
        this.selectSize = 5;
        this.ConfigurationEmailService.getDefaultWellKnownServices().then(services => {
            this.services = services;
            this.selected = this.services[0];
        });
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

    showMoreToggle() {
        if (this.showMore) {
            this.ConfigurationEmailService.getAllWellKnownServices().then(services => {
                this.selectSize = 22;
                this.services = services;
                this.selected = this.services[0];
            });
        } else {
            this.ConfigurationEmailService.getDefaultWellKnownServices().then(services => {
                this.selectsize = 5;
                this.services = services;
                this.selected = this.services[0];
            });
        }
    }

    showConfirmModal() {}

    ok() {
        let modalInstance = this.$uibModal.open({
            animation: true,
            component: 'confirmationModal',
            size: 'sm',
            resolve: {
                title: () => '',
                message: () => 'Are you sure you want to load the default ' + this.selected.name + ' configuration? Existing settings will be lost.'
            }
        });

        modalInstance.result.then(result => {
            if (result) {
                this.close({ $value: this.selected });
            }
        }, reason => {
            // console.log('modal-component dismissed with reason: ' + reason);
        });

    }

    cancel() {
        this.dismiss({ $value: 'cancel' });
    }
}

export const WellKnownServicesModalComponent = {
    bindings: {
        resolve: '<',
        close: '&',
        dismiss: '&'
    },
    template: require('./well-known-services-modal.html'),
    controller: WellKnownServicesModalController
};