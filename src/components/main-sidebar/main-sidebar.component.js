import electron from 'electron';

export class MainSidebarController {
    /*@ngInject*/
    constructor(ConfigurationTemplatesService) {
        this.ConfigurationTemplatesService = ConfigurationTemplatesService;
    }

    $onInit() {
        this.ConfigurationTemplatesService.getTemplates()
            .then(templates => this.templates = templates)
            .then(() => this.ConfigurationTemplatesService.getCurrentTemplate())
            .then(template => this.currentTemplate = template)
            .catch(console.warn);
    }

    $onChanges(changes) {
        if (changes.activeSection) {
            this.activeSection = angular.copy(changes.activeSection.currentValue);
        }
    }

    onTemplateClick(template) {
        this.currentTemplate = template;
        this.ConfigurationTemplatesService.setCurrentTemplate(template, true);
    }

    quit() {
        electron.remote.getCurrentWindow().close();
    }
}

export const MainSidebarComponent = {
    template: require('./main-sidebar.html'),
    bindings: {
        activeSection: '<'
    },
    controller: MainSidebarController
};
