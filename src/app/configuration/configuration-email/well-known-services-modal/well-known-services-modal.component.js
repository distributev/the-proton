class WellKnownServicesModalController {
    constructor(ConfigurationEmailService, $uibModal) {
        'ngInject';
        this.ConfigurationEmailService = ConfigurationEmailService;
        this.$uibModal = $uibModal;
    }

    $onInit() {
        this.ConfigurationEmailService.getDefaultWellKnownServices().then(services => {
            this.defaultServices = services;
            this.defaultSelected = this.defaultServices[0];
        });
        this.ConfigurationEmailService.getAllWellKnownServices().then(services => {
            this.allServices = services;
            this.allSelected = this.allServices[0];
        });
    }

    $onChanges(changes) {}

    ok() {
        let selected = this.showMore ? this.allSelected : this.defaultSelected;
        let modalInstance = this.$uibModal.open({
            animation: true,
            component: 'confirmationModal',
            size: 'sm',
            resolve: {
                title: () => '',
                message: () => 'Are you sure you want to load the default ' + selected.name + ' configuration? Existing settings will be lost.'
            }
        });

        modalInstance.result.then(result => {
            if (result) {
                this.close({ $value: selected });
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