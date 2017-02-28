import path from 'path';

class EditTemplateModalController {
    constructor($timeout, ConfigurationTemplatesService, configPath, defaultSettingsFile) {
        'ngInject';
        this.$timeout = $timeout;
        this.ConfigurationTemplatesService = ConfigurationTemplatesService;
        this.configPath = configPath;
        this.defaultSettingsFile = defaultSettingsFile;
    }

    $onInit() {
        this.dialogDefaultPath = this.defaultSettingsFile;
        if (!this.resolve.template) {
            this.isNewTemplate = true;
            this.resolve.template = { name: '' };
        }
        this.resolve.template.copyFrom = this.resolve.template.copyFrom || './' + this.dialogDefaultPath;
        this.updateForm();
    }

    $onChanges(changes) {}

    updateForm() {
        if (!this.resolve.template.path || this.isNewTemplate) {
            this.resolve.template.path = './config/' + (this.resolve.template.name ? _.kebabCase(this.resolve.template.name) : '<template-name>') + '.xml';
            this.resolve.template.howTo = '<config>' + this.resolve.template.path + '</config>';
        }
    }

    selectFile($event) {
        this.$timeout(() => {
            this.resolve.template.copyFrom = './' + path.relative(path.join(__dirname, this.configPath), $event.path);
        });
    }

    ok() {
        if (this.isNewTemplate && this.resolve.template.copyFrom) {
            let filePath = path.join(__dirname, this.configPath, this.resolve.template.copyFrom);
            this.ConfigurationTemplatesService.getTemplate(filePath)
                .then(template => {
                    this.resolve.template.data = template;
                    this.resolve.template.data.theproton.settings.template = this.resolve.template.name;
                    this.resolve.template.data.theproton.settings.filename = this.resolve.template.path.substr(9);
                    this.close({ $value: this.resolve.template });
                })
                .catch(console.warn);
        } else {
            this.resolve.template.data.theproton.settings.template = this.resolve.template.name;
            this.resolve.template.data.theproton.settings.filename = this.resolve.template.path.substr(9);
            this.close({ $value: this.resolve.template });
        }
    }

    cancel() {
        this.dismiss({ $value: 'cancel' });
    }
}

export const EditTemplateModalComponent = {
    bindings: {
        resolve: '<',
        close: '&',
        dismiss: '&'
    },
    template: require('./edit-template-modal.html'),
    controller: EditTemplateModalController
};