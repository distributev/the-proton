class ConfigurationGeneral {
    constructor() {
        this._containerElement = element(by.css('configuration-general'));
        this.form = this._containerElement.element(by.css('form'));
        this.form.fileName = this.form.element(by.model('$ctrl.template.fileName'));
        this.form.outputFolder = this.form.element(by.model('$ctrl.template.outputFolder'));
        this.form.quarantineFolder = this.form.element(by.model('$ctrl.template.quarantineFolder'));
        this.form.sendDocuments = this.form.element(by.model('$ctrl.template.sendDocuments'));
        this.form.deleteDocuments = this.form.element(by.model('$ctrl.template.deleteDocuments'));
        this.form.quarantineDocuments = this.form.element(by.model('$ctrl.template.quarantineDocuments'));
        this.form.submit = this.form.element(by.css('button[type="submit"]'));
    }

    save(data) {
        this.form.fileName.clear().then(() => this.form.fileName.sendKeys(data.fileName));
        this.form.outputFolder.clear().then(() => this.form.outputFolder.sendKeys(data.outputFolder));
        this.form.quarantineFolder.clear().then(() => this.form.quarantineFolder.sendKeys(data.quarantineFolder));
        if ((data.sendDocuments && !this.form.sendDocuments.isSelected()) || !data.sendDocuments && this.form.sendDocuments.isSelected()) this.form.sendDocuments.click();
        if ((data.deleteDocuments && !this.form.deleteDocuments.isSelected()) || !data.deleteDocuments && this.form.deleteDocuments.isSelected()) this.form.deleteDocuments.click();
        if ((data.quarantineDocuments && !this.form.quarantineDocuments.isSelected()) || !data.quarantineDocuments && this.form.quarantineDocuments.isSelected()) this.form.quarantineDocuments.click();
        return this.form.submit.click();
    }

    getFeedbackText() {
        return element(by.css('feedback-modal .modal-body')).getText();
    }
}

export default ConfigurationGeneral;
