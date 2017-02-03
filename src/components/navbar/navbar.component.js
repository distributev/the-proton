export class NavbarController {
    constructor() {
        'ngInject'
    }

    $onInit() {}

    changeActiveSection(section) {
        this.activeSection = section;
        this.onActiveSectionChange({
            $event: {
                section: this.activeSection
            }
        });
    }
}

export const NavbarComponent = {
    bindings: {
        activeSection: '<',
        onActiveSectionChange: '&'
    },
    template: require('./navbar.html'),
    controller: NavbarController
};