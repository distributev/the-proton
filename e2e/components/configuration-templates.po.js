import EditTemplateModal from './edit-template-modal.po';

class ConfigurationTemplates {
    constructor() {
        this._containerElement = element(by.css('configuration-templates'));
        this.form = this._containerElement.element(by.css('form'));
        this.form.actionBtns = this.form.all(by.css('.buttons-container-vertical button'));
        this.form.submit = this.form.element(by.css('button[type="submit"]'));
        this.templatesTable = this.form.all(by.css('.templates-table-container'));
    }

    add(data) {
        let addModal;
        return this.form.actionBtns.filter(function(elem) {
            return elem.getText().then(function(text) {
                return text === 'Add';
            });
        }).first().click()
        .then(function () {
            addModal = new EditTemplateModal();
            return addModal.save(data);
        });
    }

    save() {
        return this.form.submit.click();
    }

    findTemplateInList(template) {
        return this.templatesTable.all(by.repeater('template in $ctrl.formData.templates')).filter(function(elem) {
            return elem.all(by.css('td')).first().getText()
                .then(function (text) {
                    return text.toLowerCase() === template.toLowerCase();
                });
        });
    }
}

export default ConfigurationTemplates;
